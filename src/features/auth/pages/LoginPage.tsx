import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import { loginSchema, type LoginForm } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/components/layout/AuthLayout'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    setIsLoading(true)
    const result = await signIn(data.email, data.password)
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }
    const user = JSON.parse(localStorage.getItem('habitat_user') ?? 'null')
    navigate(`/${user?.role ?? 'buyer'}`, { replace: true })
  }

  const handleQuickLogin = (email: string, pass: string) => {
    setValue('email', email)
    setValue('password', pass)
    onSubmit({ email, password: pass })
  }

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Silakan masukkan kredensial akun Anda untuk mengakses portal privat Habitat."
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Pribadi / Perusahaan
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="nama@domain.com"
                {...register('email')}
                className="pl-11 h-12 rounded-2xl"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kata Sandi
              </Label>
              <span className="text-xs font-semibold text-slate-400 hover:text-slate-900 cursor-pointer">
                Lupa sandi?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="pl-11 h-12 rounded-2xl"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 font-medium">{errors.password.message}</p>}
          </div>

          <Button type="submit" size="lg" disabled={isLoading} className="w-full h-12 rounded-2xl text-sm font-bold">
            {isLoading ? (
              'Mengautentikasi…'
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="h-4 w-4 text-accent" />
              </>
            )}
          </Button>
        </form>

        {/* 1-Click Demo Login Panel */}
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Akses Cepat Mode Uji (1-Click Demo):
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('buyer@habitat.test', 'buyer123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center"
            >
              <span className="text-xs font-bold text-slate-900">Buyer</span>
              <span className="text-[10px] text-slate-400">Pencari Hunian</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('seller@habitat.test', 'seller123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-amber-500 hover:bg-amber-50/50 transition-all text-center"
            >
              <span className="text-xs font-bold text-slate-900">Seller</span>
              <span className="text-[10px] text-slate-400">Pemilik / Agen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@habitat.test', 'admin123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-violet-500 hover:bg-violet-50/50 transition-all text-center"
            >
              <span className="text-xs font-bold text-slate-900">Admin</span>
              <span className="text-[10px] text-slate-400">Moderator</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500">
          Belum memiliki akun terdaftar?{' '}
          <Link to="/register" className="font-bold text-slate-900 hover:underline">
            Daftar Anggota Baru
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
