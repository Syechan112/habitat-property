import { Link } from 'react-router-dom'
import { ArrowUpRight, User, LogOut, Home } from 'lucide-react'

interface NavbarDesktopActionsProps {
  variant: 'public' | 'dashboard'
  session: any
  role: string | null
  onSignOut: () => void
}

export default function NavbarDesktopActions({
  variant,
  session,
  role,
  onSignOut,
}: NavbarDesktopActionsProps) {
  if (variant === 'dashboard') {
    return (
      <div className="hidden md:flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 shadow-tactile-xs"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Beranda Publik</span>
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1 shadow-tactile-xs">
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-slate-950 text-[9px] sm:text-[10px] font-bold text-accent">
            {session?.user?.email ? session.user.email[0].toUpperCase() : 'U'}
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-900 max-w-[120px] truncate">
            {session?.user?.email || 'User'}
          </span>
        </div>
        <button
          onClick={onSignOut}
          className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-tactile-xs cursor-pointer"
          title="Keluar dari Akun"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-2 sm:gap-3">
      {session && role ? (
        <>
          <Link
            to={`/${role}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-tactile-xs hover:bg-slate-50"
          >
            <User className="h-3.5 w-3.5 text-emerald-600" />
            <span className="capitalize">{role} Space</span>
          </Link>
          <button
            onClick={onSignOut}
            className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-tactile-xs"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-slate-950 shadow-tactile-sm hover:bg-accent-hover"
          >
            Explore Residences
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </>
      )}
    </div>
  )
}
