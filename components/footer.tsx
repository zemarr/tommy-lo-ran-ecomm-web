"use client";

import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import TommyLoRanText from "./tommy-lo-ran-text";

const footerLinks = {
  shop: [
    { name: "Suits", href: "#" },
    { name: "Jackets", href: "#" },
    { name: "Shirts", href: "#" },
    { name: "Outerwear", href: "#" },
  ],
  info: [
    { name: "Size Guide", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
  ],
  company: [
    { name: "Story", href: "#" },
    { name: "Craftsmanship", href: "#" },
    { name: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-10xl px-6 lg:px-14">
        {/* Main Footer */}
        <div className="py-20 lg:py-24 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-2">
              <TommyLoRanText classname="font-cursive text-4xl tracking-tight text-cream" />
            </Link>
            <p className="text-cream/50 text-sm leading-loose max-w-xs mb-8">
              Rooted in culture. Tailored for now. Since 2010.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-cream/20 text-cream/50 hover:border-gold hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-cream/20 text-cream/50 hover:border-gold hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-cream/20 text-cream/50 hover:border-gold hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">
              Info
            </h4>
            <ul className="space-y-4">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="py-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} <TommyLoRanText />
          </p>
          <div className="flex items-center gap-8 text-xs text-cream/30">
            <Link href="#" className="hover:text-cream transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-cream transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
