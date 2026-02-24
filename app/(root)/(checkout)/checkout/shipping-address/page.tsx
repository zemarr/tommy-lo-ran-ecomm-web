import React from 'react';
import { auth } from '@/auth';
import { getMyCart } from '@/lib/server/actions/cart.actions';
import { getUserById } from '@/lib/server/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import ShippingAddressForm from './components/shipping-address-form';
import CheckoutSteps from '@/components/shared/checkout/checkout-steps';

export const metadata: Metadata = {
  title: 'Shipping'
}

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();

  if (!session) redirect('/sign-in');

  const userId = session?.user?.id;

  if (!userId) throw new Error('No user id');

  const user = await getUserById(userId)

  return (
    <>
      <CheckoutSteps currentStep={0} />
      <ShippingAddressForm address={user?.address as ShippingAddress} />
    </>
  )
}

export default ShippingAddressPage