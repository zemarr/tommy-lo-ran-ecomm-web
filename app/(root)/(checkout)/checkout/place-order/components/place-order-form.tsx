'use client'

import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/server/actions/order.actions'
import { Check, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FormEvent } from 'react'
import { useFormStatus } from 'react-dom'

const PlaceOrderForm = () => {
  const router = useRouter();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await createOrder();

    if (res.redirectTo) router.push(res.redirectTo)
  }

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return <Button disabled={pending} type='submit' className={"w-full py-6 text-xs tracking-[1] uppercase!"}>
      {pending ? (<><Loader className='w-4 h-4 animate-spin' />{" "}Processing your order</>) : (<><Check className='w-4 h-4' />{" "}Checkout</>)}
    </Button>
  }

  return (
    <form className='w-full' onSubmit={(e) => handleSubmit(e)}>
      <PlaceOrderButton />
    </form>
  )
}

export default PlaceOrderForm