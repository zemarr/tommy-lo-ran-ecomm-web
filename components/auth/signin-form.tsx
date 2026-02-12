'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    // Simulate sign in
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // In a real app, you would call an API here
      console.log('Sign in:', formData)
      // Redirect or show success message
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-medium tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground text-sm">
          Sign in to access your account and continue shopping
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: checked === true,
                }))
              }
              className='border border-accent-foreground/30 rounded-sm'
            />
            <label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
              Remember me
            </label>
          </div>
          <Link href="#forgot" className="text-sm font-medium text-accent-foreground hover:text-accent/80">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-sm py-6">
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/sign-up" className="font-medium text-accent-foreground hover:text-accent/80">
          Create Account
        </Link>
      </p>
    </div>
  )
}
