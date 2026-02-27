'use client'

import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag } from "lucide-react";
import Link from 'next/link';
import { signOutUser } from '../../lib/server/actions/user.actions';

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop Products", href: "/admin/products" },
  // { name: "Analytics", href: "/admin/analytics" },
  // { name: "Edit Contents", href: "/admin/edit-content" },
];

const AdminMobileMenu = ({ user }: { user: any }) => {
  const [ isOpen, setIsOpen ] = useState(false);


  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-80 bg-background border-l border-border px-8 py-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none text-foreground">{user?.name}</div>
              <div className="text-xs text-muted-foreground tracking-wide">{user?.email}</div>
            </div>
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
              <Link href="/user/profile" className="font-serif text-2xl font-light text-foreground hover:text-gold transition-colors">
                My Profile
              </Link>
              <Link href="/user/orders" className="font-serif text-2xl font-light text-foreground hover:text-gold transition-colors">
                My Orders
              </Link>
              <Link href="/admin/orders" className="font-serif text-2xl font-light text-foreground hover:text-gold transition-colors">
                All Orders
              </Link>
            </div>
            <div className="flex flex-col gap-4 pt-8 border-t border-border">
              <Link href="/shop" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs py-6">
                  Shop Now
                </Button>
              </Link>
              {!user ? (
                <Link href="/sign-in" className="flex items-center justify-center w-full bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs py-5" onClick={() => setIsOpen(false)}>
                  Sign in
                </Link>
              ) : (
                <Button
                  className="w-full flex items-center justify-center tracking-[0.15em] uppercase text-xs py-6"
                  variant="outline"
                  onClick={signOutUser}
                >
                  Sign out
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AdminMobileMenu