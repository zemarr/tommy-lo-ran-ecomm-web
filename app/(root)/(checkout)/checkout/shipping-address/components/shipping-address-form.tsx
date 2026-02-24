'use client'
import React, { useTransition } from 'react'
import { ShippingAddress } from '../../../../../../types'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { shippingAddressSchema } from '@/lib/validators'
import { zodResolver } from "@hookform/resolvers/zod"
import { shippingAddressDefaultValues } from '@/lib/constants'
import { ControllerRenderProps, useForm, SubmitHandler } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import { updateUserAddress } from '@/lib/server/actions/user.actions'
import { toast } from 'sonner'

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [ isPending, startTransition ] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues
  })

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values: any) => {
    console.log(values, 'values')
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast(res.message)
        return;
      }

      router.push("/checkout/payment-method");
    })
  }

  return (
    <div className='max-w-md mx-auto space-y-8'>
      <div className={"space-y-2"}>
        <h1 className='mt-4 font-semibold text-2xl'>Shipping Address</h1>
        <p className="text-sm text-muted-foreground">Please enter your address for shipping</p>
      </div>
      <Form {...form}>
        <form method='post' className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'> }) => (
                <FormItem className='w-full'>
                  <FormLabel htmlFor={"fullName"}>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'phoneNumber'> }) => (
                <FormItem className='w-full'>
                  <FormLabel htmlFor={"phoneNumber"}>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>Street address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="state"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'state'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row  gap-5">
            <FormField
              control={form.control}
              name="country"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'> }) => (
                <FormItem className='w-full'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} className={"py-6"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1 gap-2">
            <Button type='submit' variant={"default"} size={"default"} disabled={isPending} className={"w-full py-6 text-xs tracking-[1] uppercase!"}>{isPending ? (<Loader className='animate-spin h-4 w-4' />) : (<ArrowRight className='w-4 h-4 animate-pulse' />)}{" "}Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ShippingAddressForm