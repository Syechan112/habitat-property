import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRound, Store, Check, ArrowRight, User, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import { registerSchema, type RegisterForm } from '@/schemas/auth'
import type { UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/components/layout/AuthLayout'

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
    const result = await signUp(data.email, data.password, selectedRole)
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }
    navigate('/login', { replace: true })
  }

  return (
    <AuthLayout
      title="Registrasi Anggota Baru"
      subtitle="Bergabunglah dengan ekosistem properti terakreditasi untuk mengeksplorasi atau memasarkan hunian arsitektural."
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection Tabs */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pilih Jenis Keanggotaan
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  role: 'buyer' as const,
                  icon: UserRound,
                  title: 'Calon Pembeli',
                  desc: 'Mencari hunian & jadwal inspeksi',
                },
                {
                  role: 'seller' as const,
                  icon: Store,
                  title: 'Pemilik Properti',
                  desc: 'Pasarkan listing berstandar kurasi',
                },
              ].map(({ role, icon: Icon, title, desc }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                    selectedRole === role
                      ? 'border-slate-950 bg-slate-950 text-white shadow-tactile-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-2">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl ${
                        selectedRole === role ? 'bg-accent text-slate-950' : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {selectedRole === role && <Check className="h-4 w-4 text-accent" />}
                  </div>
                  <span className="text-sm font-bold">{title}</span>
                  <span
                    className={`text-[11px] mt-0.5 leading-snug ${
                      selectedRole === role ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nama Lengkap Sesuai KTP
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                id="fullName"
                placeholder="Contoh: Adrian Ramadhan"
                {...register('fullName')}
                className="pl-11 h-12 rounded-2xl"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-600 font-medium">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Alamat Email Aktif
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
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kata Sandi (Min. 6 Karakter)
            </Label>
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
              'Mendaftarkan Akun…'
            ) : (
              <>
                <span>Daftar Sebagai {selectedRole === 'buyer' ? 'Pembeli' : 'Penjual'}</span>
                <ArrowRight className="h-4 w-4 text-accent" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Sudah memiliki akun terdaftar?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:underline">
            Masuk ke Portal
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
