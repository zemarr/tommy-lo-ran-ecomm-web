'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus, Loader2 } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;      // selected variant (if any)
  disabled?: boolean;            // external disable flag
  className?: string;
  onAddToCart?: () => void;      // optional callback after add
}

export function AddToCartButton({
  product,
  variant,
  disabled: externalDisabled = false,
  className,
  onAddToCart,
}: AddToCartButtonProps) {
  const { addItem, updateItemQuantity, items, pendingKeys, toggleCart } = useCartStore();

  const variantKey = variant?.size ?? null;

  // Find existing cart item for this product+variant
  const cartItem = useMemo(() => {
    return items.find(
      (item) =>
        item.productId === product.id &&
        (item.variant?.size ?? null) === variantKey
    );
  }, [ items, product.id, variantKey ]);

  // Unique key for pending state tracking
  const itemKey = useMemo(() => {
    return `${ product.id }_${ variantKey ?? 'base' }`;
  }, [ product.id, variantKey ]);

  const isPending = pendingKeys.has(itemKey);

  // Available stock – variant stock if product has variants, otherwise product stock
  const availableStock = product.hasVariants
    ? variant?.stock ?? 0
    : product.stock ?? 0;

  // ─── Handlers ─────────────────────────────────────────────

  const handleAddToCart = async () => {
    if (product.hasVariants && !variant) return; // variant required but none selected
    if (isPending) return;

    await addItem(product, 1, variant);
    toggleCart(true);
    onAddToCart?.();
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity >= availableStock) return;
    if (isPending) return;

    updateItemQuantity(product.id, cartItem.quantity + 1, variant);
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (isPending) return;

    const newQuantity = cartItem.quantity - 1;
    updateItemQuantity(product.id, newQuantity, variant);
  };

  // Determine if the button should be disabled
  const isDisabled =
    externalDisabled ||
    isPending ||
    (product.hasVariants && !variant) || // variant required but missing
    availableStock === 0;                // out of stock

  // ─── Render ───────────────────────────────────────────────

  // 1. Item already in cart → show quantity controls
  if (cartItem && cartItem.quantity > 0) {
    return (
      <div className={`flex items-center gap-2 ${ className }`}>
        <button
          onClick={handleDecrease}
          disabled={cartItem.quantity == 0}
          className="flex items-center justify-center w-10 h-10 border border-border rounded-sm hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-8 text-center font-medium text-sm">
          {cartItem.quantity}
        </span>
        {/* <span className="w-8 text-center font-medium text-sm">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            cartItem.quantity
          )}
        </span> */}

        <button
          onClick={handleIncrease}
          disabled={cartItem.quantity >= availableStock}
          className="flex items-center justify-center w-10 h-10 border border-border rounded-sm hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 2. Variant product but no variant selected
  if (product.hasVariants && !variant) {
    return (
      <Button
        disabled
        variant="outline"
        className={`tracking-[0.2em] uppercase text-xs py-7 font-medium rounded-sm ${ className }`}
      >
        Select Size
      </Button>
    );
  }

  // 3. Out of stock
  if (availableStock === 0) {
    return (
      <Button
        disabled
        variant="outline"
        className={`tracking-[0.2em] uppercase text-xs py-7 font-medium rounded-sm ${ className }`}
      >
        Out of Stock
      </Button>
    );
  }

  // 4. Default Add to Cart button
  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`flex items-center justify-center gap-2 bg-charcoal text-cream hover:bg-espresso transition-all duration-300 tracking-[0.2em] uppercase text-xs py-7 font-medium rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${ className }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
          <ShoppingBag className="w-4 h-4" />
      )}
      {isPending ? 'Syncing...' : 'Add to Cart'}
    </Button>
  );
}