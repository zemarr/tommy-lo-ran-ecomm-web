"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store/cart-store";
import { CartSidebar } from "@/components/cart-sidebar";
import TommyLoRanText from "./tommy-lo-ran-text";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop Products", href: "/admin/shop" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Edit Contents", href: "/admin/edit-content" },
];

export function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto max-w-10xl px-6 lg:px-14">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <TommyLoRanText classname="font-cursive text-2xl md:text-4xl tracking-tight text-foreground" />
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex lg:items-center lg:gap-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted transition-colors rounded-sm"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-[10px] font-medium text-charcoal flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link href="/shop">
                <Button className="bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs px-6 py-5">
                  Shop
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-muted transition-colors rounded-sm"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-[10px] font-medium text-charcoal flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 bg-background border-l border-border px-8 py-16">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="font-serif text-2xl font-light text-foreground hover:text-gold transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-border">
                      <Link href="/shop" className="block" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs py-6">
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
