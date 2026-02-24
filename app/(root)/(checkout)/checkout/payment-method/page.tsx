import React from 'react'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { getUserById } from '@/lib/server/actions/user.actions'
import PaymentMethodForm from './components/payment-method-form'
import CheckoutSteps from '@/components/shared/checkout/checkout-steps'

export const metadata: Metadata = {
  title: 'Select Payment Method'
}

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  return (
    <div>
      <CheckoutSteps currentStep={1} />
      <PaymentMethodForm prefferedMethod={user.paymentMethod} />
    </div>
  )
}

export default PaymentMethodPage