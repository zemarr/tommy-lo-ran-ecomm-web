'use client'

import React from 'react'
import { useCartStore } from '../../lib/store/cart-store'
import Image from 'next/image'
import Price from '../shared/price'

const OrderItemsComponent = () => {
  const { items } = useCartStore()
  return (
    <>
      <div className="space-y-4 border-b border-border pb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
              <Image
                src={item.product.images[ 0 ]}
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
    </>
  )
}

export default OrderItemsComponent