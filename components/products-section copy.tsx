"use client";

import { services } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

export function ProductsSection() {
  return (
    <section id="collections" className="py-32 lg:py-48">
      <div className="mx-auto max-w-10xl px-6 lg:px-14">
        {/* Section Header - Minimal */}
        <div className="mb-24 lg:mb-32">
          <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-6">
            Our Collection
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Culture, Tailored.
          </h2>
          <p className="text-muted-foreground leading-loose max-w-2xl mt-6">
            Each curated piece embodies intentional storytelling. Contemporary silhouettes rooted in our dignified African culture as well as customized orders.
          </p>
        </div>

        {/* Editorial Grid - Large Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {services.slice(0, 6).map((service, index) => (
            <Link
              key={service.id}
              href={`/shop/${service.id}`}
              className={`group block ${index === 0 || index === 3 ? '' : ''}`}
            >
              <article>
                {/* Editorial Image Container - High Quality */}
                <div className={`relative overflow-hidden mb-8 bg-muted aspect-11/12 ${index === 0 || index === 3
                  ? ''
                  : ''
                  }`}>
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={`${service.name} - editorial service photography`}
                    width={100}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  {/* Museum lighting effect */}
                  <div className="absolute inset-0 bg-linear-to-b from-charcoal/0 via-transparent to-charcoal/20 pointer-events-none" />
                  {/* Hover state - subtle */}
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-700 pointer-events-none" />
                </div>

                {/* Minimal Content */}
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">
                      {service.category}
                    </p>
                    <h3 className="font-heading text-2xl lg:text-3xl font-light text-foreground group-hover:text-gold transition-colors duration-500">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {service.price}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
