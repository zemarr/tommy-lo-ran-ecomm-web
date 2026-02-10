"use client";

import { ArrowRight, LucidePhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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
              <Image width="50" height="50" src="data:image/png;base64,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" alt="whatsapp--v1" className="ml-3 h-5 w-5 text-gold/80" />
              <div className="flex flex-col justify-start text-cream/60">
                <a href="https://wa.me/447399786398" target="_blank">+44-7399-786398</a>
                <a href="https://wa.me/2347012071851" target="_blank">+2347012071851</a>
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
