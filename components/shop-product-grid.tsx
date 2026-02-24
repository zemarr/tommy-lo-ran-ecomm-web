"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Product } from "@/types";

interface ShopProductGridProps {
  products: Product[];
  isLoading?: boolean;
  resultsCount?: number;
}

export function ShopProductGrid({
  products,
  isLoading = false,
  resultsCount,
}: ShopProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-3/4 bg-muted rounded-sm mb-6" />
            <div className="h-4 bg-muted rounded mb-3 w-3/4" />
            <div className="h-3 bg-muted rounded mb-2 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full py-24 text-center">
        <p className="text-muted-foreground text-lg">
          No products found. Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <>
      {resultsCount !== undefined && (
        <p className="text-sm text-muted-foreground my-8">
          Showing {products.length} of {resultsCount} products
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <article key={product.id} className="group flex flex-col">
            {/* Product Link */}
            <Link
              href={`/shop/${product.slug}`}
              className="flex-1"
            >
              {/* Product Image */}
              <div className="aspect-3/4 overflow-hidden bg-muted mb-6 relative">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {/* Museum lighting effect */}
                <div className="absolute inset-0 bg-linear-to-b from-charcoal/0 via-transparent to-charcoal/5 pointer-events-none" />
              </div>

              {/* Product Info */}
              <div className="space-y-2 mb-4">
                <p className="text-xs tracking-widest uppercase text-gold">
                  {product.category}
                </p>
                <h3 className="font-sans font-medium text-lg text-foreground group-hover:text-gold transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                <p className="text-lg font-medium text-foreground pt-3">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>
            </Link>

            {/* Add to Cart Button */}
            <AddToCartButton product={product} className="w-full" />
          </article>
        ))}
      </div>
    </>
  );
}
