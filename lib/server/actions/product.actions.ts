'use server';
import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "@/lib/constants";
import { convertToPlainObject, formatError, normalizeProduct } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type { InsertProductSchema, Product, UpdateProductSchema } from "@/types";
import { insertProductSchema } from "../../validators";

// get latest products
export async function getLatestProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: LATEST_PRODUCTS_LIMIT,
    });

    return convertToPlainObject(products);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return [];
  }
}

// get single product by it's slug
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!product) {
    return null;
  }

  const safeData = {
    ...product,
    care: product.care ?? "",
    fit: product.fit ?? "",
    deliveryFee: product.deliveryFee as { lag: number; nationwide: number } | null,
    createdAt: product.createdAt.toDateString(),
    // updatedAt: product.updatedAt.toDateString()
  };

  return convertToPlainObject(safeData);
}

// get product by id
export async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  if (!product) return null; // product not found

  return convertToPlainObject(product);
}

// get all products
// export async function getAllProducts({
//   query,
//   limit = PAGE_SIZE,
//   page,
//   category,
//   price,
//   rating,
//   sort
// }: {
//     query?: string;
//     limit?: number;
//     page: number;
//     category?: string;
//     price?: string;
//     rating?: string;
//     sort?: string;
//   }) {
// get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}): Promise<{ data: Product[]; totalPages: number }> {
  // query filter
  const queryFilter: Prisma.ProductWhereInput = query && query !== 'all' ? {
    name: {
      contains: query,
      mode: 'insensitive'
    } as Prisma.StringFilter,
  } : {};
  // category filter
  const categoryFilter = category && category !== 'all' ? { category } : {};
  // price filter
  const priceFilter: Prisma.ProductWhereInput = price && price !== 'all' ? {
    price: {
      gte: Number(price.split('-')[ 0 ]),
      lte: Number(price.split('-')[ 1 ])
    }
  } : {};
  // rating filter
  const ratingFilter = rating && rating !== 'all' ? {
    rating: {
      gte: Number(rating)
    }
  } : {};

  const products = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter
    },
    orderBy: sort === 'lowest' ? {
      price: 'asc'
    } : sort === 'highest' ? {
      price: 'desc'
    } : sort === 'rating' ? {
      rating: 'desc'
    } : {
      createdAt: 'desc'
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const dataCount = await prisma.product.count();

  return {
    data: convertToPlainObject(
      products.map((product) =>
        normalizeProduct({
          ...product,
          price: product.price.toString(),
          rating: product.rating.toString(),
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt ? product.updatedAt.toISOString() : "",
        }),
      ),
    ),
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!existingProduct) throw new Error('Product not found');

    await prisma.product.delete({
      where: { id: id },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// create a product
export async function createProduct(data: InsertProductSchema) {
  try {
    const { deliveryFee, ...product } = data;

    await prisma.product.create({
      data: {
        ...product,
        deliveryFee: deliveryFee
          ? (deliveryFee as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product added successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// // update a product
// export async function updateProduct(data: UpdateProductSchema) {
//   try {
//     const product = {
//       ...data,
//       // rating: 0,
//     };
//     const existingProduct = await prisma.product.findFirst({
//       where: { id: product.id },
//     });

//     if (!existingProduct) throw new Error('Product not found');

//     await prisma.product.update({
//       where: { id: product.id },
//       data: product,
//     });

//     revalidatePath('/admin/products');

//     return {
//       success: true,
//       message: 'Product updated successfully',
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: formatError(error),
//     };
//   }
// }

// get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });
  return data;
}

// update a product
export async function updateProduct(data: UpdateProductSchema) {
  try {
    const product = {
      ...data,
      // rating: 0,
    };
    const existingProduct = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!existingProduct) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: {
        ...product,
        popularity: 0,
        deliveryFee: {}
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}