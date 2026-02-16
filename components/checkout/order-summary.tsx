'use client'

import { useCartStore } from '@/lib/store/cart-store'
import Image from 'next/image'
import Price from '../shared/price'

export default function OrderSummary() {
  const { items, getTotalPrice } = useCartStore()
  const total = getTotalPrice()
  const shipping = total > 0 ? 0 : 0 // Free shipping for demo
  const tax = Math.round(total * 0.1 * 100) / 100 // 10% tax
  const finalTotal = total + shipping + tax

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Order Summary</h3>

        {/* Items */}
        <div className="space-y-4 border-b border-border pb-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.product.name}</p>
                <p className="text-xs font-medium text-muted-foreground">Qty: {item.quantity}</p>
                <div className="text-sm font-semibold text-accent">
                  {/* {(Number(item.product.price) * item.quantity).toLocaleString()} */}
                  <Price
                    className="text-xs"
                    amount={(Number(item.product.price) * item.quantity).toString()}
                    currencyCode={"NGN"}
                    currencyCodeClassName="hidden @[275px]/label:inline"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <Price
              className="text-sm font-medium"
              amount={total.toString()}
              currencyCode={"NGN"}
              currencyCodeClassName="hidden @[275px]/label:inline"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <div className="text-accent">
              FREE
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            {/* <span>${tax.toLocaleString()}</span> */}
            <Price
              className="text-sm font-medium"
              amount={tax.toString()}
              currencyCode={"NGN"}
              currencyCodeClassName="hidden @[275px]/label:inline"
            />
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-semibold">
            <span>Total</span>
            {/* <span className="text-lg text-accent">${finalTotal.toLocaleString()}</span> */}
            <Price
              className="text-sm font-medium"
              amount={finalTotal.toString()}
              currencyCode={"NGN"}
              currencyCodeClassName="hidden @[275px]/label:inline"
            />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2 text-center text-xs text-muted-foreground">
        <p>✓ Secure checkout with SSL encryption</p>
        <p>✓ 30-day satisfaction guarantee</p>
        <p>✓ Free returns</p>
      </div>
    </div>
  )
}
