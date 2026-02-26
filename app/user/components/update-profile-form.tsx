'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUserProfileSchema } from '@/lib/validators';
import { updateProfile } from '@/lib/server/actions/user.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react'
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { User } from 'next-auth';


const UpdateProfileForm = ({ user }: { user: User }) => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    }
  })

  const onSubmit = async (values: z.infer<typeof updateUserProfileSchema>) => {
    const res = await updateProfile(values);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    const newSession = {
      ...session,
      user: {
        ...user,
        name: values.name
      }
    }

    await update(newSession);

    if (res.success) {
      // refresh to update the ui
      location.reload();
      toast.success(res.message);
    }
  }
  return (
    <Form {...form}>
      <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input className='input-field py-6' placeholder="John Does" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled className='input-field' placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <div className="mt-8">
          <Button size={'lg'} variant={'default'} type='submit' className='button col-span-2 w-full h-auto py-4' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Update profile'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateProfileForm