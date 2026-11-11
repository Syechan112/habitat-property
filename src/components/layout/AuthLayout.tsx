import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function AuthLayout({
  children,
  title = 'Masuk ke Akun Habitat',
  subtitle = 'Akses koleksi privat, jadwal inspeksi hunian, dan manajemen portofolio properti.',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left Column: Architectural Editorial Showcase (Hidden on Mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-slate-950 text-white">
        {/* Background Image with Depth Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
            alt="Architectural Residence"
            className="h-full w-full object-cover opacity-45 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
          <div className="absolute inset-0 bg-radial from-transparent to-slate-950/80" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-tactile-md transition-transform group-hover:scale-105">
              <span className="text-lg font-black tracking-tight">H</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-white">HABITAT</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent mt-0.5">
                Curated Properties
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Bottom Editorial Content & Floating Card */}
        <div className="relative z-10 space-y-8 max-w-lg">
          {/* Floating Metric Card */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-2xl shadow-tactile-xl">
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Standar Arsitektur Terakreditasi</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-white leading-snug">
              "Hunian bukan sekadar tempat bernaung, melainkan perpanjangan dari estetika dan kenyamanan hidup."
            </p>
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <div>
                <p className="font-bold text-white">Bramastyo Wirawan</p>
                <p className="text-slate-400">Chief Curator, Habitat Properties</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-accent font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Terverifikasi</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div>
              <p className="text-lg font-black text-white">IDR 3.4T+</p>
              <p className="text-[11px] uppercase tracking-wider">Aset Terkelola</p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <p className="text-lg font-black text-white">99.4%</p>
              <p className="text-[11px] uppercase tracking-wider">Tingkat Legalitas Bersih</p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <p className="text-lg font-black text-white">450+</p>
              <p className="text-[11px] uppercase tracking-wider">Hunian Pilihan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Card Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Mobile Back / Brand */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white font-black">
                H
              </div>
              <span className="text-base font-black text-slate-950">HABITAT</span>
            </Link>
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              ← Beranda
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Slot */}
          {children}
        </div>
      </div>
    </div>
  )
}
