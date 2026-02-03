"use client";

import { Play } from "lucide-react";

const craftDetails = [
  {
    number: "01",
    title: "Hand-Guided Stitching",
    description: "Each stitch is an act of intention. Up to 100 per buttonhole.",
  },
  {
    number: "02",
    title: "Living Canvas",
    description: "Full canvas structures that breathe and mold with you.",
  },
  {
    number: "03",
    title: "Conscious Materials",
    description: "Fabrics chosen not just for touch, but for story.",
  },
];

export function CraftsmanshipSection() {
  return (
    <section id="craftsmanship" className="py-32 lg:py-48">
      <div className="mx-auto max-w-10xl px-6 lg:px-14">
        {/* Header */}
        <div className="mb-24 lg:mb-32 max-w-2xl">
          <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-6">
            Artistry
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
            Where Heritage
            <br />
            <span className="italic">Whispers</span> Through Thread
          </h2>
        </div>

        {/* Editorial Video/Image with Play - Museum Quality */}
        <div className="relative aspect-21/9 overflow-hidden mb-24 lg:mb-32 bg-muted video-thumbnail">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=700&fit=crop"
            alt="African craftsmanship - master tailor handstitching in studio with natural light"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Lighting gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/10 via-transparent to-charcoal/5 pointer-events-none" />

          {/* Play Button - Refined */}
          <button
            className="absolute inset-0 flex items-center justify-center group play-button"
            aria-label="Play craftsmanship video"
          >
            <div className="w-24 h-24 bg-gold/80 group-hover:bg-gold flex items-center justify-center transition-all duration-300 rounded-sm">
              <Play className="w-8 h-8 text-charcoal ml-1 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>

        {/* Craft Details - Horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {craftDetails.map((detail) => (
            <div key={detail.title} className="border-t border-border pt-8">
              <span className="text-gold text-xs tracking-[0.2em] font-medium">
                {detail.number}
              </span>
              <h3 className="font-heading text-xl font-light text-foreground mt-4 mb-3">
                {detail.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {detail.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
