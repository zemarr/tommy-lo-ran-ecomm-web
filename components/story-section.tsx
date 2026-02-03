"use client";

import TommyLoRanText from "./tommy-lo-ran-text";

export function StorySection() {
  return (
    <section id="story" className="py-32 lg:py-48 bg-card">
      <div className="mx-auto max-w-10xl px-6 lg:px-14">
        {/* Full-width Image First */}
        <div className="aspect-[21/9] overflow-hidden mb-24 lg:mb-32">
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=700&fit=crop"
            alt="Tómmy ló ràn Atelier"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Two Column Text */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Title */}
          <div>
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-6">
              Our Story
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
              Rooted in
              <br />
              <span className="italic">Traditional Heritage</span>
              <br />
              Designed for Modern Men
            </h2>
          </div>

          {/* Right - Story Text */}
          <div className="lg:pt-4">
            <div className="space-y-8 text-muted-foreground leading-loose">
              <p>
                <TommyLoRanText /> was founded in 2010 with a singular vision:
                to honor African cultural narratives through traditional and contemporary menswear. Each
                piece is a quiet conversation between tradition and the present now.
              </p>
              <p>
                From Lagos, Nigeria to countries worldwide, our philosophy remains rooted:
                weave cultural intention into every fiber. We don't simply make clothes—
                we craft stories. Stories told through handwork, through fabric selection,
                through the deliberate marriage of heritage and innovation.
              </p>
            </div>

            {/* Stats - Minimal */}
            <div className="mt-16 pt-16 border-t border-border">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="font-heading text-4xl font-light text-foreground">5</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Years</p>
                </div>
                <div>
                  <p className="font-heading text-4xl font-light text-foreground">5K+</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Garments</p>
                </div>
                <div>
                  <p className="font-heading text-4xl font-light text-foreground">10</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
