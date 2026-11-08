'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/app/providers/auth-provider'
import { registerSchema } from '@/schemas/auth'
import type { RegisterForm } from '@/schemas/auth'
import type { UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    setIsLoading(true)

    const { error } = await signUp(data.email, data.password, selectedRole)

    if (error) {
      setError(error)
      setIsLoading(false)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-center text-2xl font-semibold">Join HABITAT</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
          {errors.fullName && <div className="text-sm text-destructive">{errors.fullName.message}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <div className="text-sm text-destructive">{errors.email.message}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <div className="text-sm text-destructive">{errors.password.message}</div>}
        </div>

        <div className="space-y-2">
          <Label>I want to:</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={selectedRole === 'buyer'}
                onChange={() => setSelectedRole('buyer')}
              />
              <span>Buy properties</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={selectedRole === 'seller'}
                onChange={() => setSelectedRole('seller')}
              />
              <span>Sell properties</span>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="font-medium underline">Sign in</a>
        </div>
      </form>
    </div>
  )
}
