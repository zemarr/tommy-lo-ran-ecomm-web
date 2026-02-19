'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import PaymentForm from './payment-form'
import ShippingForm from './shipping-form'

const steps = ['shipping', 'payment', 'confirmation'] as const
type Step = typeof steps[number]

export default function CheckoutForm({ user }: { user: any }) {
  const searchParams = useSearchParams()

  const stepParam = searchParams.get('step')
  const step: Step = steps.includes(stepParam as Step)
    ? (stepParam as Step)
    : 'shipping'

  const isActive = (target: Step) =>
    steps.indexOf(step) >= steps.indexOf(target)

  if (step === 'confirmation') {
    return (
      <div className="space-y-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <span className="text-3xl">✓</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Order Confirmed!</h2>
          <p className="text-muted-foreground">
            Thank you for your purchase. We're preparing your order.
          </p>
        </div>
        <div className="rounded-sm border border-border bg-card p-3 text-left">
          <p className="text-sm text-muted-foreground mb-2">Order Number</p>
          <p className="font-semibold text-lg">
            TLR-{Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent to{' '}
          <span className="font-semibold">{user?.email}</span>
        </p>
        <Link href="/shop">
          <Button className="w-full text-xs rounded-sm py-6 mt-4 uppercase tracking-widest">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Steps Indicator */}
      <div className="flex items-center justify-between gap-4">
        <div
          className={`flex items-center justify-center rounded-sm py-2 px-3 text-center text-sm font-medium transition-colors ${isActive('shipping')
            ? 'bg-accent text-accent-foreground'
            : 'bg-accent text-accent-foreground opacity-40 cursor-not-allowed'
            }`}
        >
          1. Shipping
        </div>

        <div
          className={`flex items-center justify-center rounded-sm py-2 px-3 text-center text-sm font-medium transition-colors ${isActive('payment')
            ? 'bg-accent text-accent-foreground'
            : 'bg-accent text-accent-foreground opacity-40 cursor-not-allowed'
            }`}
        >
          2. Payment
        </div>

        <div
          className={`flex items-center justify-center rounded-sm py-2 px-3 text-center text-sm font-medium transition-colors ${isActive('confirmation')
            ? 'bg-accent text-accent-foreground'
            : 'bg-accent text-accent-foreground opacity-40 cursor-not-allowed'
            }`}
        >
          3. Confirmation
        </div>
      </div>

      {/* Shipping Form */}
      {step === 'shipping' && (
        <ShippingForm user={user} />
      )}

      {/* Payment Form */}
      {step === 'payment' && (
        <PaymentForm user={user} />
      )}
    </div>
  )
}