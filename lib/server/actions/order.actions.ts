'use server'
import { auth } from "@/auth";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { CartItem, PaymentResult } from "../../../types";
import { insertOrderSchema } from "../../validators";
import { paystack } from "../../paystack";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error('User not authenticated');

    const cart = await getMyCart();
    const userId = session?.user?.id
    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: '/shop'
      }
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: '/checkout?step=shipping'
      }
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: '/payment-method'
      }
    }

    // create order object
    const parsedOrder = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    })

    // Extract orderItems if present, and remove it from order data
    const { orderItems: _, ...orderData } = parsedOrder;

    // create a transaction to create order and order items in the database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // create order
      const createdOrder = await tx.order.create({
        data: orderData,
      });

      // create order items from cart
      if (cart.items && cart.items.length > 0) {
        await tx.orderItem.createMany({
          data: (cart.items as CartItem[]).map((item) => ({
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            slug: item.product.slug,
            image: item.product.images[ 0 ],
          })),
        });
      }
      // clear cart
      await tx.cart.update({
        where: {
          id: cart.id
        },
        data: {
          items: [],
          itemsPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        }
      });

      return createdOrder.id;
    });

    if (!insertedOrderId) throw new Error('Order not created');

    console.log(insertedOrderId, 'insertedOrderId')

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${ insertedOrderId }`
    }

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    }
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
export async function updateOrderToPaid({ orderId, paymentResult }: { orderId: string, paymentResult?: PaymentResult }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true
      }
    });
    if (!order) throw new Error('Order not found')

    if (order.isPaid) throw new Error('Order already paid for');

    // transaction to update order and account for product stock

    await prisma.$transaction(async (tx) => {
      // iterate over products and update stock
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: -item.quantity
            }
          }
        });
      }
      // update order to paid
      await tx.order.update({
        where: { id: order.id },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult
        }
      });
    });

    const updatedOrder = await prisma.order.findFirst({
      where: { id: order.id },
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

    if (!updatedOrder) throw new Error('Order not found');

    // sendEmailReciept({
    //   order: {
    //     ...updatedOrder,
    //     shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
    //     paymentResult: updatedOrder.paymentResult as PaymentResult,
    //   }
    // });

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