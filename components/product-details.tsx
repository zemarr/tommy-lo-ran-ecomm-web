"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCartStore } from "@/lib/store/cart-store";
import Image from "next/image";
import { Product } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="bg-background min-h-screen">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-10xl px-6 lg:px-14 py-8">
          <Link
            href="/#collections"
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {/* Product Section */}
        <section className="mx-auto max-w-10xl px-6 lg:px-14 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Editorial Image Gallery - Museum Quality */}
            <div className="space-y-8">
              {/* Main Image - High Resolution */}
              <div className="aspect-11/12 overflow-hidden bg-muted">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={`${product.name} - African menswear editorial photography`}
                  width={100}
                  height={300}
                  className="w-full h-full object-cover gallery-image"
                  loading="eager"
                />
                {/* Museum lighting gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-charcoal/10 pointer-events-none" />
              </div>

              {/* Thumbnails - Editorial Selection */}
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-24 overflow-hidden transition-all duration-300 bg-muted ${selectedImage === index
                      ? "opacity-100 ring-2 ring-gold"
                      : "opacity-40 hover:opacity-70"
                      }`}
                    aria-label={`View ${product.name} image ${index + 1}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      width={40}
                      height={100}
                      className="w-full h-full object-cover portrait-image"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info - Clean */}
            <div className="lg:py-8">
              {/* Category & Name */}
              <div className="mb-12">
                <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-4">
                  {product.category}
                </p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
                  {product.name}
                </h1>
                <p className="text-xl text-muted-foreground">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>

              {/* Description */}
              <div className="mb-12">
                <p className="text-muted-foreground leading-loose">
                  {product.longDescription}
                </p>
              </div>

              {/* CTA Buttons - Minimal */}
              <div className="flex flex-col gap-2 mb-16 space-y-1">
                <AddToCartButton product={product} />
                {/* <Button
                  onClick={() => {
                    addItem(product, 1);
                    setIsCartOpen(true);
                  }}
                  className="bg-gold text-charcoal hover:bg-gold/90 tracking-[0.2em] uppercase text-xs py-7 font-medium rounded-sm"
                >
                  Purchase Now
                </Button> */}
              </div>

              {/* Details - Accordion Style */}
              <div className="space-y-8">
                {/* Features */}
                <div className="border-t border-border pt-8">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">
                    Features
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Materials */}
                <div className="border-t border-border pt-8">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">
                    Materials
                  </h3>
                  <ul className="space-y-3">
                    {product.materials.map((material, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fit tips */}
                <div className="border-t border-border pt-8">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">
                    Fit tips / size chart
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-sm text-muted-foreground">
                      {product.fit}
                    </li>
                  </ul>
                </div>

                {/* Delivery */}
                <div className="border-t border-border pt-8">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">
                    Delivery
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Promise Bar */}
        <section className="bg-charcoal text-cream py-16">
          <div className="mx-auto max-w-10xl px-6 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Guarantee</p>
                <p className="font-heading text-lg text-cream">Lifetime Alterations</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Craftsmanship</p>
                <p className="font-heading text-lg text-cream">80+ Hours Handwork</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2">Shipping</p>
                <p className="font-heading text-lg text-cream">Complimentary Worldwide</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
