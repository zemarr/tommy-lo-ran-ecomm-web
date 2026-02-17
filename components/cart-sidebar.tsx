'use client';

import { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, initializeCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    initializeCart();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="backdrop fixed h-screen inset-0 bg-charcoal/40 z-9999"
          onClick={onClose}
        />
      </Transition>

      {/* Sidebar */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-300 ease-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-background z-10000 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="text-sm tracking-widest uppercase text-foreground">
                Your Cart
              </h2>
              {totalItems > 0 && (
                <span className="text-xs bg-gold text-charcoal px-2 py-1 rounded-sm font-medium">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted transition-colors rounded-sm"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto">
            {(items?.length === 0 || items === undefined) ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button
                  onClick={() => {
                    router.push("/shop");
                    onClose()
                  }}
                  className="bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs px-6 py-6"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {items?.map((item, itemIdx) => (
                  <div
                    key={item.productId}
                    className="border-b border-border pb-6 last:border-b-0"
                  >
                    {/* Product Info */}
                    <div className="flex gap-4 mb-4">
                      <img
                        src={item.product.images[itemIdx] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <h3 className="font-heading text-sm font-light text-foreground mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.product.category}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          ₦{Number(item.product.price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-border rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(
                              (item.product.id),
                              item.quantity - 1
                            )
                          }
                          className="p-1 hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-1 hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items?.length > 0 && (
            <div className="border-t border-border p-6 space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="font-heading text-sm text-foreground">
                  Subtotal
                </span>
                <span className="font-heading text-lg font-light text-foreground">
                  ₦{Number(totalPrice.toFixed(2)).toLocaleString()}
                </span>
              </div>

              {/* Checkout */}
              <Link href={`/checkout`}
                onClick={onClose}
                className="block">
                <Button className="w-full py-6 bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full py-3 border border-border text-foreground hover:bg-muted transition-colors tracking-[0.15em] uppercase text-xs font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </Transition>
    </>
  );
}
