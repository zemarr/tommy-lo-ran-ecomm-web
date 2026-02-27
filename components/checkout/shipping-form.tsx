'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { shippingAddressSchema } from '@/lib/validators'
import { shippingAddressDefaultValues } from '@/lib/constants'
import { updateUserAddress } from '@/lib/server/actions/user.actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { createOrder } from '../../lib/server/actions/order.actions'

const steps = [ 'shipping', 'payment-method', 'confirmation' ] as const
type Step = typeof steps[number]

const ShippingForm = ({ user }: { user: any }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false)

  const shippingForm = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: user?.address || shippingAddressDefaultValues,
  })


  const handleShippingSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values: any) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      const createdOrder = await createOrder();
      console.log(createdOrder, 'createdOrder')
      if (!res.success) {
        // toast(res.message)
        return;
      }
      router.push(`?step=payment-method&id=${ createdOrder?.orderId }`)
    })
  }

  // const goToStep = (step: Step) => {
  //   router.push(`?step=${ step }`)
  // }

  return (
    <Form {...shippingForm}>
      <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-1">

          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={shippingForm.control}
              name="fullName"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} className='py-6 shadow-sm rounded-sm md:text-base text-sm' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>


        <div className="flex flex-col md:flex-row  gap-5">
          <FormField
            control={shippingForm.control}
            name="streetAddress"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'> }) => (
              <FormItem className='w-full'>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your street address" {...field} className='py-6 shadow-sm rounded-sm md:text-base text-sm' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={shippingForm.control}
              name="city"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} className='py-6 shadow-sm rounded-sm md:text-base text-sm' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={shippingForm.control}
              name="state"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'state'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your state" {...field} className='py-6 shadow-sm rounded-sm md:text-base text-sm' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={shippingForm.control}
              name="postalCode"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>Zip/Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter zip/postal code" {...field} className='py-6 shadow-sm rounded-sm md:text-base text-sm' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={shippingForm.control}
              name="country"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} className='py-6 shadow-sm rounded-sm md:text-base text-sm' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full text-xs rounded-sm py-6 mt-4 uppercase tracking-widest">
          Continue to Payment Method
        </Button>
      </form>
    </Form>
  )
}

export default ShippingForm