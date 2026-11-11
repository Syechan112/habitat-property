import { Link, useLocation } from 'react-router-dom'
import { Home, LogOut, ArrowUpRight, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon?: LucideIcon
}

interface NavbarMobileMenuProps {
  isOpen: boolean
  onClose: () => void
  variant: 'public' | 'dashboard'
  role?: 'buyer' | 'seller' | 'admin'
  roleLabel?: string
  items: NavItem[]
  session: any
  signOut: () => void
}

export default function NavbarMobileMenu({
  isOpen,
  onClose,
  variant,
  role,
  roleLabel,
  items,
  session,
  signOut,
}: NavbarMobileMenuProps) {
  const location = useLocation()
  if (!isOpen) return null

  const user = session?.user

  return (
    <div className="pointer-events-auto md:hidden">
      {/* Backdrop (Only blurs and dims the page background) */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Floating Menu Popover (Sharp solid card above backdrop) */}
      <div className="relative z-50 mx-auto mt-2 w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-3 shadow-tactile-lg animate-in fade-in slide-in-from-top-2 duration-150">
        {/* User Card if logged in */}
        {session && user ? (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-accent shrink-0">
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.email || 'User Account'}
              </p>
              <span className="inline-block text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5 mt-0.5">
                {roleLabel || (role ? `${role.toUpperCase()} SPACE` : 'HABITAT')}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold text-slate-900">Selamat Datang di HABITAT</p>
            <p className="text-[11px] text-slate-500">Eksplorasi residensi & kurasi arsitektur.</p>
          </div>
        )}

        {/* Public mode: Quick link to dashboard space if logged in */}
        {variant === 'public' && session && role && (
          <div className="mb-2">
            <Link
              to={`/${role}`}
              onClick={onClose}
              className="flex items-center justify-between rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white shadow-tactile-xs transition-colors"
            >
              <span className="capitalize">Masuk ke {role} Space</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
            </Link>
          </div>
        )}

        {/* Navigation items */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi
          </div>
          {items.map(({ href, label, icon: Icon }) => {
            const isActive =
              location.pathname === href ||
              (href !== '/' && href !== '/seller' && href !== '/admin' && location.pathname.startsWith(href))

            return (
              <Link
                key={href}
                to={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-tactile-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
          {variant === 'dashboard' && (
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors"
            >
              <Home className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Kembali ke Beranda</span>
            </Link>
          )}

          {session ? (
            <button
              type="button"
              onClick={() => {
                onClose()
                signOut()
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
              <span>Keluar (Sign Out)</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={onClose}
                className="flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex h-9 items-center justify-center rounded-xl bg-accent text-xs font-bold text-slate-950 shadow-tactile-xs hover:bg-accent-hover transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
