'use client'

import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { paymentMethodSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/server/actions/user.actions';
import { toast } from 'sonner';

const PaymentMethodForm = ({ prefferedMethod }: { prefferedMethod: string | null }) => {
  const router = useRouter();
  const [ isPending, startTransition ] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: prefferedMethod || DEFAULT_PAYMENT_METHOD
    }
  })

  const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (values) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) toast.error(res.message);

      toast.success(res.message);

      router.push('/checkout/place-order')
    })
  }

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <div className={"space-y-2"}>
        <h1 className='mt-4 font-semibold text-2xl uppercase!'>Payment method</h1>
        <p className="text-sm text-muted-foreground">Please select your preferred payment method</p>
      </div>
      <Form {...form}>
        <form method='post' className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-5 mb-6">
            <FormField
              control={form.control}
              name='type'
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof paymentMethodSchema>, 'type'> }) => (
                <FormItem className='w-full'>
                  <FormLabel className='mb-3'>Available payment methods</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} className='flex flex-col space-y-2'>
                      {PAYMENT_METHODS.map((method, i) => (
                        <FormItem key={`${ i }-${ method }`} className='flex items-center spac-x-3 space-y-0'>
                          <FormControl>

                            <RadioGroupItem value={method} checked={field.value === method}>w
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
            <Button type='submit' variant={"default"} size={"default"} disabled={isPending} className={"w-full py-6 text-xs tracking-[1] uppercase!"}>{isPending ? (<Loader className='animate-spin h-4 w-4' />) : (<ArrowRight className='w-4 h-4 animate-pulse' />)}{" "}Proceed to checkout</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PaymentMethodForm