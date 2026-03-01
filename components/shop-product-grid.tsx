"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Product, ProductVariant } from "@/lib/types";

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

// Internal component to manage per‑product variant selection
function ProductCard({ product }: { product: Product }) {
  const [ selectedVariant, setSelectedVariant ] = useState<ProductVariant | null>(
    product.hasVariants && product.variants && product.variants.length > 0
      ? product.variants[ 0 ] // default to first variant
      : null
  );

  // Determine if product has variants
  const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;

  return (
    <article className="flex-1">
      {/* Product Link */}
      <div className="group flex flex-col">
        {/* Product Image */}
        <Link href={`/shop/${ product.slug }`} className="aspect-3/4 overflow-hidden bg-muted mb-6 relative">
          <img
            src={product.images[ 0 ] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Museum lighting effect */}
          <div className="absolute inset-0 bg-linear-to-b from-charcoal/0 via-transparent to-charcoal/5 pointer-events-none" />
        </Link>

        {/* Product Info */}
        <div className="space-y-2 mb-4">
          <p className="text-xs tracking-widest uppercase text-gold">
            {product.category}
          </p>
          <Link href={`/shop/${ product.slug }`}>
            <h3 className="font-sans font-medium text-lg text-foreground group-hover:text-gold transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.description}</p>

          {/* Variant selector (replaces the empty .select-size div) */}
          <div className="select-size mt-3">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Size
            </label>
            {hasVariants ? (
              <div className="flex flex-wrap gap-2">
                {product.variants!.map((variant) => {
                  const isAvailable = variant.stock > 0;
                  const isSelected = selectedVariant?.size === variant.size;

                  return (
                    <button
                      key={variant.size}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!isAvailable}
                      className={`
                        px-3 py-1 border text-xs rounded-sm transition-colors
                        ${ isSelected
                          ? "border-gold bg-gold text-black"
                          : "border-border text-muted-foreground hover:border-gold"
                        }
                        ${ !isAvailable && "opacity-40 cursor-not-allowed" }
                      `}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            ) : (<div className="flex flex-col">
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={true}
                  className={`px-3 py-1 border text-xs rounded-sm transition-all border-gold bg-gold text-black`}
                >
                  Regular
                </button>
              </div>
            </div>)}
          </div>

          <p className="text-lg font-medium text-foreground pt-3">
            ₦
            {selectedVariant?.price
              ? Number(selectedVariant.price).toLocaleString()
              : Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton
        product={product}
        variant={selectedVariant ?? undefined}
        className="w-full"
      />
    </article>
  );
}