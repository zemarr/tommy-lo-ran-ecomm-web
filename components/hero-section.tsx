"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroImage from "../public/assets/images/TLR_main.jpg"

export function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col pt-20">
      {/* Main Hero Content */}
      <div className="flex-1 flex flex-col lg:flex-row h-[80vh]">
        {/* Left - Typography */}
        <div className="flex-1 flex items-center justify-start px-6 lg:px-16 py-16 lg:py-24">
          <div className="max-w-5xl">
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-medium mb-5">
              Since 2010
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] text-foreground flex items-center flex-wrap">
              Where Tradition
              <br />
              Meets Authority
              {/* <span className="italic font-normal">Culture</span> */}
            </h1>
            <p className="mt-6 text-muted-foreground leading-loose max-w-fit text-base">
              Outfits for the modern African man, intentionally designed. Where heritage <br /> whispers through every stitch, and contemporary vision guides each thread.
            </p>
            <div className="mt-12">
              <Button
                size="lg"
                className="bg-charcoal text-cream hover:bg-espresso tracking-[0.2em] uppercase text-xs px-10 py-7 group"
              >
                Explore
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right - Hero Image - Editorial */}
        <div className="lg:flex lg:flex-1 hidden relative h-full bg-muted">
          <Image
            src={HeroImage}
            alt="African menswear editorial - model in natural light with cultural setting"
            width={100}
            height={300}
            className="w-full h-full object-cover hero-image"
            loading="eager"
          />
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-charcoal/5 pointer-events-none" />
        </div>
      </div>

      {/* Bottom Bar - Minimal Stats */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-10xl px-8 lg:px-16 h-[12vh]">
          <div className="flex items-center justify-between py-8">
            <a
              href="#collections"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Scroll to discover
            </a>
            <span>
              <ArrowDown className="animate-bounce" />
            </span>
            <a
              href="#collections"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Scroll to discover
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
