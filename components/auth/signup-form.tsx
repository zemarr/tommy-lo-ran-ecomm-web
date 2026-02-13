'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { signUpUserWithCredentials } from '@/lib/server/actions/user.actions'

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={"lg"}
      variant={"default"}
      className="w-full rounded-sm py-6"
      disabled={pending}
    >
      {pending ? 'Signing up...' : 'Sign up'}
    </Button>
  );
}

export default function SignUpForm() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';

  const [data, action] = useActionState(signUpUserWithCredentials, {
    success: false,
    message: '',
  });


  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-medium tracking-tight">Create Your Account</h2>
        <p className="text-muted-foreground text-sm">
          Join our community of fashion enthusiasts
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="password"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="confirmPassword"
            required
          />
        </div>

        <SignUpButton />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-accent-foreground hover:text-accent/80">
          Sign in
        </Link>
      </p>
    </div>
  )
}
