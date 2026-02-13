
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TommyLoRanText from "../../tommy-lo-ran-text";
import UserMenu from "./user-menu";
import CartButton from "./cart-button";
import MobileMenu from "./mobile-menu";
import { auth } from "@/auth";

const navigation = [
  { name: "Our Story", href: "/#story" },
  { name: "Our Collection", href: "/#collections" },
  { name: "Services", href: "/#services" },
  // { name: "Craftsmanship", href: "/#craftsmanship" },
];

export default async function Header() {
  const session = await auth();

  return (
    <React.Fragment>
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
              <CartButton />


              <Link href="/shop">
                <Button className="bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs px-6 py-5">
                  Shop
                </Button>
              </Link>
              {/* User menu */}
              {session?.user?.name ? (
                <UserMenu />
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center w-max text-foreground text-xs tracking-[0.2em] leading-4 uppercase p-1 border-b border-espresso"
                // onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-4">
              <CartButton />
              <MobileMenu user={session?.user} />
            </div>
          </div>
        </nav>
      </header>
    </React.Fragment>
  );
}
