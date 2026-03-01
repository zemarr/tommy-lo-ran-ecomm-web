'use server'
import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { CartItem, PaymentResult } from "../../types";
import { insertOrderSchema } from "../../validators";
import { paystack } from "../../paystack";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_cache } from "next/cache";
import { PAGE_SIZE } from "../../constants";
import { Prisma } from "@prisma/client";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error('User not authenticated');

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: '/shop'
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: '/checkout?step=shipping'
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: '/payment-method'
      };
    }

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Fetch all products with variants for items in cart
      const productIds = cart.items.map(item => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        include: { variants: true },
      });
      const productMap = new Map(products.map(p => [ p.id, p ]));

      let itemsPrice = 0;
      const orderItemsData = [];

      for (const item of cart.items) {
        const product = productMap.get(item.productId);
        if (!product) throw new Error(`Product ${ item.productId } not found`);

        let price: number;
        let variantSize: string | undefined;

        if (item.variant) {
          const variant = product.variants.find(v => v.size === item.variant?.size);
          if (!variant) {
            throw new Error(`Variant size ${ item.variant.size } not found for product ${ product.name }`);
          }
          price = Number(variant.price ?? product.price);
          variantSize = variant.size;
        } else {
          price = Number(product.price);
        }

        const itemTotal = price * item.quantity;
        itemsPrice += itemTotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: price.toFixed(2),
          name: `${ product.name }${ variantSize ? ` - ${ variantSize }` : "" }`,
          slug: product.slug,
          image: product.images[ 0 ] || '',
          size: variantSize,
        });
      }

      // Calculate tax and shipping (use your actual logic)
      const taxPrice = itemsPrice * 0.1;
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      // Prepare order data with proper types
      const orderData: Prisma.OrderCreateInput = {
        user: { connect: { id: user.id } }, // relational style (avoids userId field)
        shippingAddress: user.address as Prisma.InputJsonValue, // cast to satisfy Prisma
        paymentMethod: `${ user?.paymentMethod }`, // string, non-null due to earlier check
        itemsPrice: itemsPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      };

      const createdOrder = await tx.order.create({ data: orderData });

      // Create order items with variant size
      if (orderItemsData.length > 0) {
        await tx.orderItem.createMany({
          data: orderItemsData.map(item => ({
            ...item,
            orderId: createdOrder.id,
          })),
        });
      }

      // Clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: '0',
          taxPrice: '0',
          shippingPrice: '0',
          totalPrice: '0',
        },
      });

      return createdOrder.id;
    });

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${ insertedOrderId }`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get order by id
export async function getOrderById(orderId: string) {
  if (!orderId) throw new Error('Order ID missing')

  const data = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return convertToPlainObject(data);
}

// update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new Error('Order not found');
    if (order.isPaid) throw new Error('Order already paid for');

    // Transaction to update order and deduct stock (handling variants)
    await prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        if (item.size) {
          // Variant product – deduct from ProductVariant.stock
          const variant = await tx.productVariant.findFirst({
            where: {
              productId: item.productId,
              size: item.size,
            },
          });
          if (!variant) {
            throw new Error(`Variant not found for product ${ item.productId } size ${ item.size }`);
          }
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for variant ${ item.size } of product ${ item.productId }`);
          }
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          // Non‑variant product – deduct from Product.stock
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) throw new Error(`Product ${ item.productId } not found`);
          if ((product.stock ?? 0) < item.quantity) {
            throw new Error(`Insufficient stock for product ${ item.productId }`);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Mark order as paid
      await tx.order.update({
        where: { id: order.id },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult,
        },
      });
    });

    // Fetch updated order (optional, for email receipt)
    const updatedOrder = await prisma.order.findFirst({
      where: { id: order.id },
      include: {
        orderItems: true,
        user: { select: { name: true, email: true } },
      },
    });

    // Send email receipt (commented out)
    // if (updatedOrder) {
    //   sendEmailReceipt({ order: updatedOrder });
    // }

    return {
      success: true,
      message: 'Order paid for successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// create new paystack order
export async function createPaystackOrder(email: string, orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      // create paystack order
      const paystackOrder = await paystack.createOrder(email, Number(order.totalPrice));

      // update order with paystack order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            ...paystackOrder.data,
            status: 'created',
            email_address: email,
            pricePaid: 0
          }
        }
      });

      return { success: true, message: 'Order created successfully', data: paystackOrder.data }
    } else {
      throw new Error('Order not found')
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
// approve paystack order payment and update order to "Paid"
export async function approvePaystackOrder(orderId: string, transactionRef: any) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error('Order not found')
    if (!transactionRef) throw new Error('Transaction not found')

    const captureData = await paystack.capturePayment(transactionRef);

    if (!captureData || captureData.message !== "Verification successful" || !captureData.data.id) throw new Error('Error verifying your payment');

    // update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        ...captureData.data,
        id: captureData.data.id,
        status: captureData.data.status,
        email_address: captureData.data[ "customer" ].email,
        pricePaid: String(captureData.data.amount / 100),
      }
    })

    revalidatePath(`/order/${ orderId }`);

    return {
      success: true,
      message: 'Order paid for successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

// update COD order to paid
export async function updateCODOrderToPaid(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${ orderId }`);

    return {
      success: true,
      message: 'Order marked as PAID'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

// update COD paid order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId }
    });

    if (!order) throw new Error('Order not found');
    if (!order.isPaid) throw new Error('Order not paid for');

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date()
      }
    })

    revalidatePath(`/order/${ orderId }`)

    return {
      success: true,
      message: 'Order has been marked as delivered'
    }
  } catch (error) {
    return {
      success: false, message: formatError(error)
    }
  }
}

// GET USER'S ORDERS
export async function getMyOrders({
  limit = PAGE_SIZE || 10,
  page
}: {
  limit?: number;
  page: number
}) {
  const session = await auth();

  if (!session) throw new Error('User not authorized');

  const data = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit,
    skip: (page - 1) * limit,
    // include: {
    //   orderitems: true,
    //   user: {
    //     select: {
    //       name: true,
    //       email: true
    //     }
    //   }
    // }
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id }
  })

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit)
  };
}

// get sales data and order summary
type SalesDataType = {
  month: string;
  totalSales: number;
}[];
export async function getOrderSummary() {
  // get the counts for each resource
  // Get the total number of orders in the database

  // get cached ordersCount
  const cachedOrdersCount = unstable_cache(
    async () => {
      const ordersCount = await prisma.order.count();
      return ordersCount;
    },
    [ 'cache:orders-count' ], // Cache key
    // {
    //   revalidate: 60, // Optional: Revalidate every 60 seconds
    //   // You can add tags here if you need to revalidate on-demand
    //   // tags: ['orders'],
    // }
  );
  const ordersCount = await cachedOrdersCount();

  // Get the total number of products in the database
  const productsCount = await prisma.product.count();

  // Get the total number of users in the database
  const usersCount = await prisma.user.count();
  // get the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    }
  });

  // get the total orders by mm/yy from the db
  const rawSalesData = await prisma.$queryRaw<Array<{ month: string, totalSales: Prisma.Decimal }>>`
  SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')
  `;

  const salesData: SalesDataType = rawSalesData.map(entry => ({
    month: entry.month,
    totalSales: Number(entry.totalSales ?? 0), // Fallback to 0 if totalSales is null or undefined
  }));

  // get latest 5 orders/sales
  const latestSales = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: { name: true }
      }
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales: Number(totalSales._sum.totalPrice),
    salesData,
    latestSales
  };
}

export async function getAllOrders({
  query,
  limit = PAGE_SIZE,
  page
}: {
  query: string;
  limit?: number;
  page: number;
}) {

  const queryFilter: Prisma.OrderWhereInput = query && query !== 'all' ? {
    user: {
      name: {
        contains: query,
        mode: 'insensitive'
      } as Prisma.StringFilter
    }
  } : {};

  const data = await prisma.order.findMany({
    where: { ...queryFilter },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } }, orderItems: { select: { product: { select: { name: true } } } } }
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  };
}
// delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id }
    });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }

  }
}
