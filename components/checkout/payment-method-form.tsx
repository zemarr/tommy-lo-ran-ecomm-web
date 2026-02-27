'use client'

import React, { startTransition, useTransition } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { paymentMethodSchema } from '@/lib/validators'
import { Button } from '../ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserPaymentMethod } from '@/lib/server/actions/user.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'

const steps = [ 'shipping', 'payment', 'pay', 'confirmation' ] as const
type Step = typeof steps[ number ]

const PaymentMethodForm = ({ user, order }: { user: any; order: any; }) => {
  const router = useRouter();
  const { clearCart } = useCartStore();

  const [ isPending, startTransition ] = useTransition();

  const goToStep = (step: Step) => {
    router.push(`?step=${ step }`);
  }

  const paymentForm = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: user?.paymentMethod!! || DEFAULT_PAYMENT_METHOD
    }
  })

  const handlePaymentSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (values: any) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) toast.error(res.message);

      setTimeout(() => {
        toast.success(res.message);
        goToStep('pay')
        // clearCart();
      }, 2000)
    })
  }

  return (
    <Form {...paymentForm}>
      <form method='post' className='space-y-4' onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}>
        <div className="flex flex-col md:flex-row gap-5 mb-6">
          <FormField
            control={paymentForm.control}
            name='type'
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof paymentMethodSchema>, 'type'> }) => (
              <FormItem className='w-full'>
                <FormLabel className='mb-3'>Available payment methods</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className='flex flex-col space-y-2'>
                    {PAYMENT_METHODS.map((method, i) => (
                      <FormItem key={`${ i }-${ method }`} className='flex items-center spac-x-3 space-y-0'>
                        <FormControl>

                          <RadioGroupItem value={method} checked={field.value === method}>
                            True
                          </RadioGroupItem>
                        </FormControl>
                        <FormLabel className='font-normal'>{method}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className="flex gap-2">
          <Button disabled={isPending} type="submit" className="w-full text-xs rounded-sm py-6 mt-4 uppercase tracking-widest">
            {isPending ? (<Loader className='animate-spin h-4 w-4' />) : (<ArrowRight className='w-4 h-4 animate-pulse' />)}{" "}Proceed to payment
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PaymentMethodForm