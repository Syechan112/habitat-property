import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import NavbarMobileMenu from './NavbarMobileMenu'
import NavbarDesktopActions from './NavbarDesktopActions'
import {
  PUBLIC_NAV_ITEMS,
  getDashboardNavItems,
  ROLE_LABELS,
  type NavItem,
} from './navbar-config'

export type { NavItem }

export interface NavbarProps {
  variant?: 'public' | 'dashboard'
  role?: 'buyer' | 'seller' | 'admin'
  customItems?: NavItem[]
}

export default function Navbar({
  variant = 'public',
  role: propRole,
  customItems,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, role: authRole, signOut } = useAuth()
  const location = useLocation()

  const currentRole = propRole || (authRole as 'buyer' | 'seller' | 'admin') || 'buyer'
  const roleLabel = ROLE_LABELS[currentRole]

  const items =
    customItems ??
    (variant === 'dashboard' ? getDashboardNavItems(currentRole) : PUBLIC_NAV_ITEMS)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none transition-all duration-300">
      <nav
        className={`relative z-50 pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 sm:px-5 py-2 sm:py-2.5 transition-all duration-300 ${
          mobileOpen
            ? 'bg-white border border-slate-200/90 shadow-tactile-md'
            : scrolled
            ? 'glass-panel shadow-tactile-lg border-slate-200/90'
            : 'bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-tactile-md'
        }`}
      >
        {/* Left: Brand (+ Desktop Breadcrumb) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-tactile-xs transition-transform group-hover:scale-105">
              <span className="text-xs sm:text-sm font-black">H</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs sm:text-sm font-black tracking-tight text-slate-950">
                HABITAT
              </span>
              {variant === 'public' && (
                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5 hidden xs:inline">
                  Curated Living
                </span>
              )}
            </div>
          </Link>

          {variant === 'dashboard' && roleLabel && (
            <div className="hidden md:flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 rounded-full px-2.5 sm:px-3 py-1">
                {roleLabel}
              </span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/70 p-1 border border-slate-200/60">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive =
              location.pathname === href ||
              (href !== '/' && href !== '/seller' && href !== '/admin' && location.pathname.startsWith(href))
            return (
              <Link
                key={href}
                to={href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-tactile-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right: Desktop Actions */}
        <NavbarDesktopActions
          variant={variant}
          session={session}
          role={authRole}
          onSignOut={signOut}
        />

        {/* Right: Mobile Burger Drop Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-tactile-xs md:hidden active:scale-95 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span
              className={`h-0.5 w-3.5 rounded-full bg-slate-900 transition-all duration-300 ${
                mobileOpen ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-3.5 rounded-full bg-slate-900 transition-all duration-300 ${
                mobileOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-3.5 rounded-full bg-slate-900 transition-all duration-300 ${
                mobileOpen ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Dropdown Popover */}
      <NavbarMobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant={variant}
        role={currentRole}
        roleLabel={roleLabel}
        items={items}
        session={session}
        signOut={signOut}
      />
    </header>
  )
}
