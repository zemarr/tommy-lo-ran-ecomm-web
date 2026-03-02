'use server'

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { convertToPlainObject, formatError } from '@/lib/utils'
import { cookies } from 'next/headers';
import { prisma } from '@/db/prisma';
import { CartItem, CartOperation, cartOperationSchema, StoredCartItem } from '../../types/cart.types';

export async function updateCart(input: CartOperation) {
  try {
    // 1. Validate input
    const { productId, quantity, variant } = cartOperationSchema.parse(input);

    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id;

    // 2. Fetch product with variants
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });
    if (!product) throw new Error('Product not found');

    // 3. Validate stock and get effective price
    let availableStock: number;
    let effectivePrice: string;

    if (variant?.size) {
      const productVariant = product.variants.find(v => v.size === variant.size);
      if (!productVariant) throw new Error('Variant not found');
      availableStock = productVariant.stock;
      effectivePrice = productVariant.price?.toString() ?? product.price.toString();
    } else {
      if (product.hasVariants) throw new Error('Product requires variant selection');
      availableStock = product.stock ?? 0;
      effectivePrice = product.price.toString();
    }

    // 4. If quantity > 0, check stock
    if (quantity > 0 && quantity > availableStock) {
      throw new Error(`Only ${ availableStock } available`);
    }

    // 5. Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { sessionCartId },
    });

    // 6. Prepare the new items array
    let updatedItems: StoredCartItem[];

    if (!cart) {
      // New cart
      updatedItems = quantity > 0
        ? [ {
          productId,
          quantity,
          variant: variant?.size ? { size: variant.size, price: effectivePrice } : undefined,
        } ]
        : [];
    } else {
      const currentItems = cart.items as StoredCartItem[];

      // Find existing item index
      const existingIndex = currentItems.findIndex(item =>
        item.productId === productId &&
        (item.variant?.size ?? null) === (variant?.size ?? null)
      );

      if (quantity === 0) {
        // Remove item
        updatedItems = currentItems.filter((_, idx) => idx !== existingIndex);
      } else if (existingIndex >= 0) {
        // Update existing
        updatedItems = currentItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity }
            : item
        );
      } else {
        // Add new
        updatedItems = [
          ...currentItems,
          {
            productId,
            quantity,
            variant: variant?.size ? { size: variant.size, price: effectivePrice } : undefined,
          },
        ];
      }
    }

    // 7. Calculate prices based on current product data
    const prices = await calculatePrices(updatedItems);

    // 8. Save to database
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionCartId,
          userId,
          items: updatedItems as any,
          ...prices,
        },
      });
    } else {
      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: updatedItems as any,
          ...prices,
        },
      });
    }

    // 9. Revalidate relevant paths
    revalidatePath('/cart');
    revalidatePath(`/shop/${ product.slug }`);

    return {
      success: true,
      message: quantity === 0
        ? 'Item removed'
        : quantity > (input.quantity ? 1 : 0) // simplistic message
          ? 'Quantity updated'
          : 'Item added',
      cart: convertToPlainObject(updatedItems),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Helper to calculate prices (you can reuse your existing logic but adapt to StoredCartItem)
async function calculatePrices(items: StoredCartItem[]) {
  if (items.length === 0) {
    return {
      itemsPrice: '0',
      taxPrice: '0',
      shippingPrice: '0',
      totalPrice: '0',
    };
  }

  const productIds = items.map(i => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });

  const productMap = new Map(products.map(p => [ p.id, p ]));

  let itemsPrice = 0;
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product ${ item.productId } not found`);

    let price: number;
    if (item.variant?.size) {
      const variant = product.variants.find(v => v.size === item.variant?.size);
      price = Number(variant?.price ?? product.price);
    } else {
      price = Number(product.price);
    }
    itemsPrice += price * item.quantity;
  }

  // Your tax/shipping logic
  const taxPrice = itemsPrice * 0.1;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return {
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

// Keep getMyCart as is but ensure it returns StoredCartItem[] (which matches your DB)
export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) return undefined;

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [
        userId ? { userId } : undefined,
        { sessionCartId },
      ].filter(Boolean) as any,
    },
  });

  if (!cart) return undefined;

  const storedItems = cart.items as StoredCartItem[];

  if (storedItems.length === 0) {
    return convertToPlainObject({
      ...cart,
      items: [],
    });
  }

  // Get all product IDs from cart items
  const productIds = storedItems.map(item => item.productId);

  // Fetch all products with their variants
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });

  // Create a map for quick lookup
  const productMap = new Map(products.map(p => [ p.id, p ]));

  // Enrich each stored item with full product data
  // Enrich items
  const enrichedItems: CartItem[] = storedItems
    .map(item => {
      const product = productMap.get(item.productId);
      if (!product) return null; // product deleted – remove item

      // Validate variant consistency
      if (product.hasVariants && !item.variant) return null;
      if (!product.hasVariants && item.variant) return null;

      // Build product object (stock optional)
      const cartProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price.toString(),
        images: product.images,
        stock: product.stock ?? undefined, // make optional
      };

      // Build variant if present
      let variant: CartItem[ 'variant' ] = undefined;
      if (item.variant) {
        const productVariant = product.variants.find(v => v.size === item.variant!.size);
        if (!productVariant) return null; // variant no longer exists – remove item

        variant = {
          productId: product.id, // required
          size: productVariant.size,
          stock: productVariant.stock, // always a number
          price: productVariant.price?.toString(),
        };
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        product: cartProduct,
        variant,
      };
    })
    .filter((item) => item !== null);

  return convertToPlainObject({
    ...cart,
    items: enrichedItems,
  });
}