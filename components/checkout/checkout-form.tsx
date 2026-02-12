'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'

const steps = ['shipping', 'payment', 'confirmation'] as const
type Step = typeof steps[number]

export default function CheckoutForm() {
  const { clearCart } = useCartStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const stepParam = searchParams.get('step')
  const step: Step = steps.includes(stepParam as Step)
    ? (stepParam as Step)
    : 'shipping'

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    // Shipping
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Payment
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  })

  const [loading, setLoading] = useState(false)

  const goToStep = (step: Step) => {
    router.push(`?step=${step}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    goToStep('payment')
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      goToStep('confirmation')
      clearCart()
    }, 2000)
  }

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
          <span className="font-semibold">{formData.email}</span>
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
        <form onSubmit={handleShippingSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-6 shadow-sm rounded-sm md:text-base text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="py-6 shadow-sm rounded-sm md:text-base text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State/Province</label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP/Postal Code</label>
              <Input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
          </div>

          <Button type="submit" className="w-full text-xs rounded-sm py-6 mt-4 uppercase tracking-widest">
            Continue to Payment
          </Button>
        </form>
      )}

      {/* Payment Form */}
      {step === 'payment' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cardholder Name</label>
            <Input
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="py-6 shadow-sm rounded-sm md:text-base text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <Input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              required
              className="py-6 shadow-sm rounded-sm md:text-base text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVC</label>
              <Input
                name="cvc"
                value={formData.cvc}
                onChange={handleChange}
                placeholder="123"
                required
                className="py-6 shadow-sm rounded-sm md:text-base text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-xs rounded-sm py-6 mt-4 uppercase tracking-widest"
              onClick={() => goToStep('shipping')}
            >
              Back
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 text-xs rounded-sm py-6 mt-4 uppercase tracking-widest">
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}