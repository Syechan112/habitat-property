'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/app/providers/auth-provider'
import { loginSchema } from '@/schemas/auth'
import type { LoginForm } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    setIsLoading(true)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setError(error)
      setIsLoading(false)
      return
    }

    const { role } = useAuth()
    if (role) {
      navigate(`/${role}`, { replace: true })
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-center text-2xl font-semibold">Sign in to HABITAT</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>)}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && (<div className="text-sm text-destructive">{errors.email.message}</div>)}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && (<div className="text-sm text-destructive">{errors.password.message}</div>)}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>

        <div className="mt-4 text-center text-sm">
          Don’t have an account? <a href="/register" className="font-medium underline">Sign up</a>
        </div>
      </form>
    </div>
  )
}
