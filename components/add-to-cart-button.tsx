'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/products';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  onAddToCart?: () => void;
}

export function AddToCartButton({
  product,
  className,
  onAddToCart,
}: AddToCartButtonProps) {
  const { addItem, updateQuantity, items } = useCartStore();

  const cartItem = useMemo(() => {
    return items.find((item) => item.product.id === product.id);
  }, [items, product.id]);

  const handleAddToCart = () => {
    addItem(product, 1);
    onAddToCart?.();
  };

  const handleIncrease = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  if (cartItem && cartItem.quantity > 0) {
    return (
      <div className={`flex items-center gap-8 rounded-sm py-2 ${className}`}>
        <button
          onClick={handleDecrease}
          className="flex items-center justify-center w-10 h-10 border border-border rounded-sm hover:bg-muted transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium text-sm">{cartItem.quantity}</span>
        <button
          onClick={handleIncrease}
          className="flex items-center justify-center w-10 h-10 border border-border rounded-sm hover:bg-muted transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-2 bg-charcoal text-cream hover:bg-espresso transition-all duration-300 tracking-[0.2em] uppercase text-xs py-7 font-medium rounded-sm ${className}`}
    >
      <ShoppingBag className="w-4 h-4" />
      Add to Cart
    </Button>
  );
}
