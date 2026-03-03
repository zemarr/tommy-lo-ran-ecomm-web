// components/cart/cart-provider.tsx
'use client';

import { useEffect } from 'react';
import { useCartStore } from '../../../lib/store/cart-store';
import { getMyCart } from '../../../lib/server/actions/cart.actions';
import { CartSidebar } from '../../cart-sidebar';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    getMyCart()
      .then((cart) => {
        if (cart?.items) {
          initializeCart(cart.items); // now each item has product
        } else {
          initializeCart([]);
        }
      })
      .catch((error) => {
        console.error('Failed to load cart:', error);
        initializeCart([]);
      });
  }, [ initializeCart ]);

  return (
    <>
      <CartSidebar />
      {children}
    </>
  );
}
