'use client'

import { useCartStore } from "@/lib/store/cart-store";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const CartButton = () => {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => toggleCart(true)}
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
    </>
  )
}

export default CartButton