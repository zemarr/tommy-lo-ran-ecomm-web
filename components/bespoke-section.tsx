"use client";

import { Ruler, Scissors, Sparkles, Clock } from "lucide-react";

const services = [
  {
    icon: Ruler,
    title: "Precision Tailoring",
    description: "Every piece is crafted with expert attention to fit and detail that defines true bespoke luxury.",
  },
  {
    icon: Scissors,
    title: "Premium Fabric Selection",
    description: "We source high-quality traditional and luxury fabrics, ensuring lasting quality and comfort.",
  },
  {
    icon: Sparkles,
    title: "Cultural Craftsmanship ",
    description: "Our designs celebrate rich African heritage while embracing modern, global elegance.",
  },
  {
    icon: Clock,
    title: "Limited Production",
    description: "We focus on quality over quantity, ensuring each garment receives the personal attention and mastery it deserves.",
  },
];

export function BespokeSection() {
  return (
    <section id="services" className="py-32 lg:py-48 bg-charcoal text-cream">
      <div className="mx-auto max-w-10xl px-6 lg:px-14">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Image */}
          <div className="aspect-3/4 overflow-hidden">
            <img
              src="/assets/images/DSC_5216.jpeg"
              alt="Luxury suit details"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="flex flex-col justify-center">
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-6">
              Our Craft
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-cream leading-tight mb-16">
              Intentional and Cultural
              <br />
              <span className="italic">Creation</span>
            </h2>

            {/* Services Grid - Minimal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {services.map((service) => (
                <div key={service.title} className="group">
                  <service.icon className="w-5 h-5 text-gold mb-4" />
                  <h3 className="font-heading text-xl font-light text-cream mb-2">
                    {service.title}
                  </h3>
                  <p className="text-cream/60 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
