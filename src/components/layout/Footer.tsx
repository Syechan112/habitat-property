import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-14 sm:pt-20 pb-10 sm:pb-14 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-16 border-b border-slate-100">
          {/* Brand Manifesto */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-tactile-sm">
                <span className="text-base font-extrabold tracking-tight">H</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-black tracking-tight text-slate-950">HABITAT</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Properties
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              Kurasi properti berstandar arsitektur tinggi. Menghubungkan pembeli selektif dengan pemilik hunian mahakarya melalui transparansi legalitas dan penjelajahan spasial berpresisi tinggi.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>100% Verified Ownership & Escrow Protected</span>
            </div>
          </div>

          {/* Column 1: Koleksi */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Koleksi
            </p>
            <ul className="space-y-2.5 text-sm font-medium text-slate-600">
              <li>
                <Link to="/buyer/properties" className="hover:text-slate-950 transition-colors">
                  Semua Hunian
                </Link>
              </li>
              <li>
                <Link to="/buyer/properties" className="hover:text-slate-950 transition-colors">
                  Vila Tropis Modern
                </Link>
              </li>
              <li>
                <Link to="/buyer/properties" className="hover:text-slate-950 transition-colors">
                  Urban Penthouse
                </Link>
              </li>
              <li>
                <Link to="/buyer/properties" className="hover:text-slate-950 transition-colors">
                  Rumah Minimalis Zen
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Platform
            </p>
            <ul className="space-y-2.5 text-sm font-medium text-slate-600">
              <li>
                <Link to="/buyer/compare" className="hover:text-slate-950 transition-colors">
                  Matriks Perbandingan
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-slate-950 transition-colors">
                  Daftarkan Properti Seller
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-950 transition-colors">
                  Portal Masuk Anggota
                </Link>
              </li>
              <li>
                <Link to="/living-pillars" className="hover:text-slate-950 transition-colors">
                  Standar Verifikasi 3D
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Konsultasi Privat */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Konsultasi Privat
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dapatkan katalog eksklusif hunian rahasia (off-market) yang belum dipublikasikan.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="nama@email.com"
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-xs outline-none focus:border-slate-900 focus:bg-white"
              />
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 text-xs font-medium text-slate-400 text-center sm:text-left">
          <p>© 2026 HABITAT Properties · All Rights Reserved. Curated Architectural Platform.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Operasional Normal
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hover:text-slate-700 cursor-pointer">Privasi</span>
            <span className="hover:text-slate-700 cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
