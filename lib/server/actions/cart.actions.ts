'use server'

import { auth } from '@/auth';
import { cartItemSchema, cartProductSchema, insertCartSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { formatError } from '@/lib/utils';
import { Cart, CartItem } from '@/types';
import { convertToPlainObject, roundToTwoDecimalPlaces } from '@/lib/utils';
import { cookies } from 'next/headers';
import { prisma } from '@/db/prisma';

// calculate cart prices
export async function calculateCartPrices(items: CartItem[]) {
  // Extract unique product IDs
  const productIds = items?.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true },
  });

  const priceMap = new Map(products.map(p => [p.id, Number(p.price)]));

  let itemsPrice = 0;
  for (const item of items) {
    const currentPrice = priceMap.get(item.productId);
    if (!currentPrice) throw new Error(`Product ${item.productId} not found`);
    itemsPrice += currentPrice * item.quantity;
  }

  // Example tax and shipping logic – adjust to your business rules
  const taxPrice = itemsPrice * 0.1; // 10% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // free over $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return {
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

export async function addToCart(productId: string, quantity: number) {
  try {
    // 1️⃣ Get cart session
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    // 2️⃣ Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // 3️⃣ Clamp quantity to available stock
    const finalQuantity = Math.min(quantity, product.stock);

    if (finalQuantity <= 0) {
      throw new Error("Product out of stock");
    }

    // 4️⃣ Get existing cart
    const cart = await getMyCart();

    let updatedItems: CartItem[];

    // 5️⃣ Shape minimal cart snapshot (NEVER spread full product)
    const cartProductSnapshot = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      images: product.images ?? [],
      stock: product.stock,
    };

    const parsedProduct = cartProductSchema.safeParse(cartProductSnapshot);
    if (!parsedProduct.success) {
      console.error(parsedProduct.error.flatten());
      throw new Error("Cart product validation failed");
    }

    const parsedItem = cartItemSchema.safeParse({
      productId: product.id,
      product: parsedProduct.data,
      quantity: finalQuantity,
    });

    if (!parsedItem.success) {
      console.error(parsedItem.error.flatten());
      throw new Error("Cart item validation failed");
    }

    const validatedItem = parsedItem.data;

    // 6️⃣ If no cart → create one
    if (!cart) {
      updatedItems = [ validatedItem ];

      const prices = await calculateCartPrices(updatedItems);

      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: updatedItems,
        ...prices,
      });

      await prisma.cart.create({ data: newCart });
    } else {
      const currentItems = cart.items as CartItem[];

      const existingIndex = currentItems.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex > -1) {
        // Update quantity (clamped)
        currentItems[ existingIndex ].quantity = finalQuantity;
      } else {
        currentItems.push(validatedItem);
      }

      updatedItems = currentItems;

      const prices = await calculateCartPrices(updatedItems);

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: convertToPlainObject(updatedItems) as CartItem[],
          ...prices,
        },
      });
    }

    revalidatePath(`/shop/${ product.slug }`);

    return {
      success: true,
      message:
        finalQuantity < quantity
          ? `Only ${ finalQuantity } items available — cart adjusted`
          : `${ product.name } added to cart`,
      cart: updatedItems,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  try {
    // check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    // if there is no cart cookie, create a new one
    if (!sessionCartId) throw new Error('Cart session not found');
    const session = await auth();
    const userId = session?.user?.id;

    if (quantity < 0) throw new Error('Quantity cannot be negative');
    // get user cart from db
    const cart = await prisma.cart.findFirst({
      where: { sessionCartId },
    });

    if (!cart) throw new Error('Cart not found');

    const items = cart.items as CartItem[];
    const itemIndex = items?.findIndex(i => i.productId === productId);
    if (itemIndex === -1) throw new Error('Item not in cart');

    if (quantity === 0) {
      // Remove item
      items.splice(itemIndex, 1);
    } else {
      // Check stock
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) throw new Error('Product not found');
      if (product.stock < quantity) throw new Error('Not enough stock');

      items[itemIndex].quantity = quantity;
    }

    const prices = await calculateCartPrices(items);
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: items as any,
        ...prices,
      },
    });

    return {
      success: true,
      message: 'Cart updated',
      cart: items,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getMyCart() {
  // check for the cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value ?? undefined;

  // if there is no cart cookie, create a new one
  if (!sessionCartId) throw new Error('Cart session not found');

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [
        userId ? { userId } : undefined,
        { sessionCartId }
      ].filter(Boolean) as any,
    },
  });

  if (!cart) return undefined;

  // Optionally refresh product data in items (to ensure latest prices)
  const items = cart.items;
  // We could refresh each product's current data here
  // For simplicity, we return stored items; client can refresh if needed

  return convertToPlainObject({
    ...cart,
    items: items as CartItem[],
    id: cart?.id,
  });
}

export async function removeFromCart(productId: string) {
  return updateCartItemQuantity(productId, 0); // reuse with quantity 0
}

export async function clearCart() {
  try {
    // check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    // if there is no cart cookie, create a new one
    if (!sessionCartId) throw new Error('Cart session not found');
    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
      where: { sessionCartId },
    });
    if (!cart) throw new Error('Cart not found');

    const emptyItems: CartItem[] = [];
    const prices = await calculateCartPrices(emptyItems);
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        ...prices,
        items: emptyItems as any,
      },
    });

    return { success: true, message: 'Cart cleared', cart: emptyItems };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}