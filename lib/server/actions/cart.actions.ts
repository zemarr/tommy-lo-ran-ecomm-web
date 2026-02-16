'use server'

import { auth } from '@/auth';
import { cartItemSchema, insertCartSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { formatError } from '@/lib/utils';
import { Cart, CartItem } from '@/types';
import { convertToPlainObject, roundToTwoDecimalPlaces } from '@/lib/utils';
import { cookies } from 'next/headers';
import { prisma } from '@/db/prisma';
import { randomUUID } from 'crypto';

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

export async function getSessionCartId() {
  const cookieStore = await cookies();
  let sessionCartId = cookieStore.get('sessionCartId')?.value;

  if (!sessionCartId) {
    sessionCartId = randomUUID();
    cookieStore.set('sessionCartId', sessionCartId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionCartId;
}

export async function addToCart(productId: string, quantity: number) {
  try {
    const sessionCartId = await getSessionCartId();
    const session = await auth();
    const userId = session?.user?.id;

    // Validate input
    if (quantity <= 0) throw new Error('Quantity must be positive');
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error('Not enough stock');

    // Find existing cart
    let cart = await prisma.cart.findFirst({
      where: { sessionCartId },
    });

    // Prepare the new item (full product object snapshot – optional, but we'll use current product)
    const newItem = {
      productId: product.id,
      product: {
        ...product, // careful: product has Decimal price, convert to string if needed
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price.toString(),
        images: product.images,
        stock: product.stock,
        // include other fields as needed by cartProductSchema
      },
      quantity,
    };

    // Validate item structure
    const validatedItem = cartItemSchema.parse(newItem);

    let updatedItems: CartItem[];

    if (!cart) {
      // Create new cart
      updatedItems = [validatedItem];
      const prices = await calculateCartPrices(updatedItems);
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: updatedItems,
        ...prices,
      });
      console.log(newCart, 'new cat')
      await prisma.cart.create({ data: newCart });
    } else {
      // Update existing cart
      const currentItems = cart.items as CartItem[];
      const existingIndex = currentItems?.findIndex(i => i.productId === productId);

      if (existingIndex > -1) {
        // Update quantity
        const newQty = quantity;
        if (newQty > product.stock) throw new Error('Not enough stock');
        currentItems[existingIndex].quantity = newQty;
      } else {
        // Add new item
        currentItems.push(validatedItem);
      }

      updatedItems = currentItems;
      const prices = await calculateCartPrices(updatedItems);
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: convertToPlainObject(updatedItems) as CartItem[], // Prisma.JsonValue
          ...prices,
        },
      });
    }

    revalidatePath(`/shop/${product.slug}`);
    return {
      success: true,
      message: `${product.name} added to cart`,
      cart: updatedItems, // send back updated items for client sync
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  try {
    const sessionCartId = await getSessionCartId();
    const session = await auth();
    const userId = session?.user?.id;

    if (quantity < 0) throw new Error('Quantity cannot be negative');
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
  const cartId = { sessionCartId: sessionCartId };
  // console.log({ sessionCartId: sessionCartId }, { userId: userId })
  const cart = await prisma.cart.findFirst({
    where: cartId,
  });

  if (!cart) return null;

  // Optionally refresh product data in items (to ensure latest prices)
  const items = cart.items;
  // You could refresh each product's current data here
  // For simplicity, we return stored items; client can refresh if needed

  return convertToPlainObject({
    items: items as CartItem[],
    id: cart?.id,
  });
}

export async function removeFromCart(productId: string) {
  return updateCartItemQuantity(productId, 0); // reuse with quantity 0
}

export async function clearCart() {
  try {
    const sessionCartId = await getSessionCartId();
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