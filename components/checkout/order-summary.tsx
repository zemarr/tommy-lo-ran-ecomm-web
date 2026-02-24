import Price from '../shared/price'
import { Cart, Order, User } from '@prisma/client'
import { Button } from '../ui/button'
import OrderItemsComponent from './order-items-component'
import { getOrderById } from '../../lib/server/actions/order.actions';

export default async function OrderSummary({ cart, user, callbackUrl, orderId }: { cart?: Cart | null, user?: User | null, callbackUrl?: string; orderId?: string; }) {

  const order = await getOrderById(orderId as string);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Order Summary</h3>

        {/* Items */}
        <OrderItemsComponent />

        {/* Totals */}
        <div className="space-y-3 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <Price
              className="text-sm font-medium"
              amount={cart?.itemsPrice?.toString() || '0.00'}
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
              amount={cart?.taxPrice?.toString() || '0.00'}
              currencyCode={"NGN"}
              currencyCodeClassName="hidden @[275px]/label:inline"
            />
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-semibold">
            <span>Total</span>
            {/* <span className="text-lg text-accent">${finalTotal.toLocaleString()}</span> */}
            <Price
              className="text-sm font-medium"
              amount={cart?.totalPrice?.toString() || '0.00'}
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
