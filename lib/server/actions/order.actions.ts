'use server'
import { auth } from "@/auth";
import { formatError } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    const user = await getUserById(userId);


    const insertedOrderId = await prisma.$transaction(async (tx) => {
      if (!user?.address) {
        return {
          success: false,
          message: "No shipping address",
          redirectTo: "/checkout?step=shipping",
        };
      }

      if (!user?.paymentMethod) {
        return {
          success: false,
          message: "No payment method",
          redirectTo: "/checkout?step=payment",
        };
      }

      // 🔥 1. Validate stock & reduce it
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${item.product.name}`
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // 🔥 2. Create order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          shippingAddress: user.address as Prisma.InputJsonValue,
          paymentMethod: user.paymentMethod,

          itemsPrice: new Prisma.Decimal(cart.itemsPrice),
          taxPrice: new Prisma.Decimal(cart.taxPrice),
          shippingPrice: new Prisma.Decimal(cart.shippingPrice),
          totalPrice: new Prisma.Decimal(cart.totalPrice),
        },
      });

      // 🔥 3. Create order items
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,

            price: new Prisma.Decimal(item.product.price),

            name: item.product.name,
            slug: item.product.slug,
            image: item.product.images[0],
          },
        });
      }

      // 🔥 4. Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: new Prisma.Decimal("0.00"),
          taxPrice: new Prisma.Decimal("0.00"),
          shippingPrice: new Prisma.Decimal("0.00"),
          totalPrice: new Prisma.Decimal("0.00"),
        },
      });

      return createdOrder.id;
    });

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };

  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}