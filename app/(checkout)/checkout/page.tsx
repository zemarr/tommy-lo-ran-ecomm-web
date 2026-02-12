import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";
import { Suspense } from "react";


export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your purchase</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form - Left */}
          <div className="lg:col-span-2">
            <div className="rounded-sm border border-border bg-card pt-4 pb-8 md:px-4 px-4 md:text-base! text-sm!">
              <Suspense>
                <CheckoutForm />
              </Suspense>
            </div>
          </div>

          {/* Order Summary - Right */}
          <div>
            <div className="sticky top-20">
              <Suspense>
                <OrderSummary />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
