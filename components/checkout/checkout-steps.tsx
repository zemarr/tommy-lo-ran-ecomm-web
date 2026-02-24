import { cn } from '@/lib/utils'
import React from 'react'

const CheckoutSteps = ({ currentStep = 0 }) => {
  return (
    <>
      {/* if (step === 'confirmation') {
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
            {order.id}
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
  } */}
      <div className='flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10'>
        {
          [ 'Shipping', 'Payment', 'Checkout' ].map((step, i) => (
            <React.Fragment key={i}>
              <div className={cn('py-2 px-6 w-max mx-6 rounded-full text-center text-sm', i === currentStep ? 'bg-secondary' : '')}>{step}</div>
              {step !== ('Checkout') && (
                <hr className='w-16 border-t border-gray-300 mx-2' />
              )}
            </React.Fragment>
          ))
        }
      </div>
    </>
  )
}

export default CheckoutSteps