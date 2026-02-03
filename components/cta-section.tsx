"use client";

import { ArrowRight, LucidePhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTASection() {
  return (
    <section id="contact" className="py-32 lg:py-48 bg-charcoal text-cream">
      <div className="mx-auto max-w-10xl px-6 lg:px-14">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32">
          {/* Left - Shop CTA */}
          <div>
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-6">
              Find Your Piece
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-cream leading-tight mb-8">
              Every Garment,
              <br />
              <span className="italic">A Story</span>
            </h2>
            <p className="text-cream/60 leading-loose mb-12 max-w-md">
              Discover our collection. Contemporary menswear rooted in cultural intention. Shipped with care, worldwide.
            </p>
            <Button
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold-dark tracking-[0.2em] uppercase text-xs px-10 py-7 group"
            >
              Shop Collection
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right - Newsletter */}
          <div className="lg:border-l lg:border-cream/10 lg:pl-24">

            <h3 className="font-heading text-2xl font-light text-cream mb-4">
              Contact Us
            </h3>

            <div className="flex gap-4 mb-3">
              <LucidePhoneCall className="ml-3 h-4 w-4 text-gold/80" />
              <div className="flex flex-col justify-start text-cream/60">
                <a href="tel:+2347012071851">+2347012071851</a>
              </div>
            </div>
            <div className="flex gap-4">
              <LucidePhoneCall className="ml-3 h-4 w-4 text-gold/80" />
              <div className="flex flex-col justify-start text-cream/60">
                <a href="tel:+447399786398">+44-7399-786398</a>
                <a href="tel:+2347012071851">+2347012071851</a>
              </div>
            </div>

            <h3 className="font-heading text-2xl font-light text-cream mb-4 mt-8">
              Stay Connected
            </h3>

            <p className="text-cream/60 text-sm leading-loose mb-8">
              Receive stories from our atelier. New collections, cultural insights, and invitations to thoughtful moments.
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="bg-transparent border-cream/20 text-cream placeholder:text-cream/40 focus:border-gold h-14"
              />
              <Button
                type="submit"
                className="w-full bg-cream text-charcoal hover:bg-cream/90 tracking-[0.2em] uppercase text-xs py-6"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
