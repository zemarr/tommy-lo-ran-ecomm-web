'use server';
import { prisma } from "@/db/prisma";
import { getFileId, LATEST_PRODUCTS_LIMIT, PAGE_SIZE, uploadThingApiBaseUrl } from "@/lib/constants";
import { convertToPlainObject, formatError, normalizeProduct } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import type { InsertProductSchema, Product, UpdateProductSchema } from "@/lib/types";

// get single product by it's slug
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    include: {
      variants: true
    }
  });

  if (!product) {
    return null;
  }

  const safeData = {
    ...product,
    care: product.care ?? "",
    fit: product.fit ?? "",
    variants: product.variants ?? undefined,
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
    include: {
      variants: true,
    }
  });

  if (!product) return null; // product not found

  const safeData = {
    ...product,
    care: product.care ?? "",
    fit: product.fit ?? "",
    variants: product.variants ?? undefined,
    deliveryFee: product.deliveryFee as { lag: number; nationwide: number } | null,
    createdAt: product.createdAt.toDateString(),
    // updatedAt: product.updatedAt.toDateString()
  };

  return convertToPlainObject(safeData);
}

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

  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      }
      : {};

  const categoryFilter =
    category && category !== 'all' ? { category } : {};

  const ratingFilter =
    rating && rating !== 'all'
      ? {
        rating: {
          gte: Number(rating),
        },
      }
      : {};

  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
        OR: [
          {
            hasVariants: false,
            price: {
              gte: Number(price.split('-')[ 0 ]),
              lte: Number(price.split('-')[ 1 ]),
            },
          },
          {
            hasVariants: true,
            variants: {
              some: {
                price: {
                  gte: Number(price.split('-')[ 0 ]),
                  lte: Number(price.split('-')[ 1 ]),
                },
              },
            },
          },
        ],
      }
      : {};

  const whereClause = {
    ...queryFilter,
    ...categoryFilter,
    ...ratingFilter,
    ...priceFilter,
  };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      variants: true,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
          ? { price: 'desc' }
          : sort === 'rating'
            ? { rating: 'desc' }
            : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({
    where: whereClause,
  });

  return {
    data: convertToPlainObject(
      products.map((product) =>
        normalizeProduct({
          ...product,
          price: product.price.toString(),
          rating: product.rating.toString(),
          variants: product?.variants?.map((v) => ({
            ...v,
            price: v.price?.toString(),
          })),
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt
            ? product.updatedAt.toISOString()
            : "",
        })
      )
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

    const fileIds: string[] = existingProduct.images.map((img: string) => getFileId(img));

    if (existingProduct && fileIds.length > 0) {
      // delete image(s) from uploadthing
      const res = await fetch(`${ uploadThingApiBaseUrl }/v6/deleteFiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-uploadthing-api-key': process.env.UPLOADTHING_SECRET!,
        },
        body: JSON.stringify({ fileKeys: fileIds }),
      });

      const result = await res.json();
    }

    if (!existingProduct) throw new Error('Product not found');

    // delete product after deleting image from uploadthing
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
    const {
      deliveryFee,
      variants,
      hasVariants,
      stock,
      price, // string from form
      ...product
    } = data;

    // Convert product price to Decimal
    const productPrice = new Prisma.Decimal(price);

    // Prepare variants: remove productId if present and convert price to Decimal
    const variantsData = variants?.map(({ productId: _ignore, ...variant }) => ({
      size: variant.size,
      stock: variant.stock,
      price: variant.price ? new Prisma.Decimal(variant.price) : undefined,
    }));

    await prisma.product.create({
      data: {
        ...product,
        price: productPrice,
        hasVariants,

        // stock: only set if no variants
        stock: hasVariants ? null : stock,

        // deliveryFee: store as JSON
        deliveryFee: deliveryFee
          ? (deliveryFee as Prisma.InputJsonValue)
          : Prisma.JsonNull,

        // variants: only create if hasVariants is true
        variants: hasVariants
          ? {
            create: variantsData,
          }
          : undefined,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

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
    const {
      id,
      variants,
      hasVariants,
      stock,
      deliveryFee,
      ...productFields
    } = data;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Update product base fields
      await tx.product.update({
        where: { id },
        data: {
          ...productFields,
          hasVariants,
          stock: hasVariants ? null : stock,
          deliveryFee: deliveryFee
            ? (deliveryFee as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        },
      });

      // 2️⃣ Handle variants
      if (hasVariants) {
        // Delete old variants
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });

        // Recreate new variants
        if (variants && variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((variant) => ({
              productId: id,
              size: variant.size,
              stock: variant.stock,
              price: variant.price
                ? new Prisma.Decimal(variant.price)
                : null,
            })),
          });
        }
      } else {
        // If switching to non-variant, remove all variants
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });
      }
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}