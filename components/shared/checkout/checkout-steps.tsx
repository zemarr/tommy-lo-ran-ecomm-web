import { cn } from '@/lib/utils'
import React from 'react'

const CheckoutSteps = ({ currentStep = 0 }) => {
  return (
    <div className='flex justify-between items-center flex-row space-x-2 space-y-2 mb-10 mt-20 mx-auto'>
      {
        [ 'Shipping', 'Payment', 'Checkout' ].map((step, i) => (
          <React.Fragment key={i}>
            <div className={cn('py-2 md:px-6 px-3 w-max md:mx-6 mx-0 rounded-full text-center text-xs uppercase! font-medium tracking-[1]', i === currentStep ? 'bg-accent' : '')}>{step}</div>
            {step !== ('Checkout') && (
              <hr className='w-0 border-t border-gray-300 mx-2 hidden' />
            )}
          </React.Fragment>
        ))
      }
    </div>
  )
}

export default CheckoutSteps