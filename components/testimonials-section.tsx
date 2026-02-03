"use client";

import { useState } from "react";

const testimonials = [
  {
    id: 1,
    quote: "Each piece carries a quiet intention. It's not just clothing—it's a conversation with heritage.",
    author: "Anonymous",
    title: "",
    location: "Abuja, Nigeria",
  },
  {
    id: 2,
    quote: "They understand that luxury is about meaning. Every fiber tells a story.",
    author: "Anonymous",
    title: "",
    location: "Lagos, Nigeria",
  },
  {
    id: 3,
    quote: "Wearing Tómmy ló ràn feels like wearing poetry. Refined. Intentional. Real.",
    author: "Anonymous",
    title: "",
    location: "Lagos, Nigeria",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-32 lg:py-48 bg-card">
      <div className="mx-auto max-w-5xl px-6 lg:px-14">
        {/* Quote - Large Typography */}
        <div className="text-center mb-16">
          <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-relaxed italic">
            &ldquo;{testimonials[activeIndex].quote}&rdquo;
          </p>
        </div>

        {/* Author */}
        <div className="text-center mb-16">
          <p className="font-heading text-lg text-foreground">
            {testimonials[activeIndex].author}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {testimonials[activeIndex].title}{testimonials[activeIndex].title.length > 0 && ","} {testimonials[activeIndex].location}
          </p>
        </div>

        {/* Minimal Navigation - Just Dots */}
        <div className="flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 transition-colors ${index === activeIndex ? 'bg-gold' : 'bg-border hover:bg-muted-foreground'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
