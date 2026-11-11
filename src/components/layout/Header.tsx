import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TrendingUp, Compass, Building2, ArrowUpRight, User, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'

export interface LandingNavItem {
  path: string
  id: string
  label: string
  icon: typeof TrendingUp
}

// Urutan tab disusun persis sesuai struktur landing page dari atas ke bawah:
// 1. MetricBanner (#metrics) -> 2. BentoFeatures (#living-pillars) -> 3. FeaturedProperties (#architecture)
export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { path: '/metrics', id: 'metrics', label: 'Metrik', icon: TrendingUp },
  { path: '/living-pillars', id: 'living-pillars', label: 'Keunggulan', icon: Compass },
  { path: '/architecture', id: 'architecture', label: 'Koleksi', icon: Building2 },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activePath, setActivePath] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session, role, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Sinkronisasi posisi scroll dengan active tab dan clean URL
  useEffect(() => {
    const isLandingSurface =
      location.pathname === '/' ||
      location.pathname === '/metrics' ||
      location.pathname === '/living-pillars' ||
      location.pathname === '/architecture' ||
      location.pathname === '/bento'

    if (!isLandingSurface) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Berada di bagian atas (Hero section)
      if (window.scrollY < 300) {
        setActivePath('/')
        if (location.pathname !== '/') {
          window.history.replaceState(null, '', '/')
        }
        return
      }

      // Evaluasi posisi section dari bawah ke atas
      // 3. architecture -> 2. living-pillars -> 1. metrics
      const sections = [
        { path: '/architecture', id: 'architecture' },
        { path: '/living-pillars', id: 'living-pillars' },
        { path: '/metrics', id: 'metrics' },
      ]

      const scrollPosition = window.scrollY + 180

      for (const { path, id } of sections) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            setActivePath(path)
            if (location.pathname !== path) {
              window.history.replaceState(null, '', path)
            }
            return
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const scrollToSection = (targetPath: string, sectionId: string) => {
    const isLandingSurface =
      location.pathname === '/' ||
      location.pathname === '/metrics' ||
      location.pathname === '/living-pillars' ||
      location.pathname === '/architecture' ||
      location.pathname === '/bento'

    if (isLandingSurface) {
      const el = document.getElementById(sectionId)
      if (el) {
        const yOffset = -90 // Offset header navbar
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        window.history.replaceState(null, '', targetPath)
        setActivePath(targetPath)
        return
      }
    }
    navigate(targetPath)
  }

  const handleNavClick = (e: React.MouseEvent, targetPath: string, sectionId: string) => {
    e.preventDefault()
    scrollToSection(targetPath, sectionId)
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    const isLandingSurface =
      location.pathname === '/' ||
      location.pathname === '/metrics' ||
      location.pathname === '/living-pillars' ||
      location.pathname === '/architecture' ||
      location.pathname === '/bento'

    if (isLandingSurface) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', '/')
      setActivePath('/')
    }
  }

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
        {/* Brand */}
        <Link to="/" onClick={handleLogoClick} className="group flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-tactile-xs transition-transform group-hover:scale-105">
            <span className="text-xs sm:text-sm font-black">H</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs sm:text-sm font-black tracking-tight text-slate-950">
              HABITAT
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5 hidden xs:inline">
              Curated Living
            </span>
          </div>
        </Link>

        {/* Center: Curated Landing Page Section Tabs (Ordered: Metrik -> Keunggulan -> Koleksi) */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/70 p-1 border border-slate-200/60">
          {LANDING_NAV_ITEMS.map(({ path, id, label, icon: Icon }) => {
            const isActive = activePath === path || location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={(e) => handleNavClick(e, path, id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-tactile-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right: Desktop Auth & Discovery Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {session && role ? (
            <>
              <Link
                to={`/${role}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-tactile-xs hover:bg-slate-50 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-emerald-600" />
                <span className="capitalize">{role} Space</span>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-tactile-xs cursor-pointer"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/buyer/properties"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-slate-950 shadow-tactile-sm hover:bg-accent-hover transition-colors"
              >
                Eksplorasi Katalog
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Right: Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-tactile-xs md:hidden active:scale-95 transition-colors cursor-pointer"
          aria-label="Toggle Menu Navigasi"
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

      {/* Mobile Popover Dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          />
          <div className="relative z-50 mx-auto mt-2 w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-tactile-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header info */}
            <div className="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">HABITAT Residences</p>
                <p className="text-[10px] text-slate-500">Kurasi Properti Mahakarya</p>
              </div>
              {session && role && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {role} Space
                </span>
              )}
            </div>

            {/* Navigation links (Ordered: Metrik -> Keunggulan -> Koleksi) */}
            <div className="space-y-1 mb-3">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigasi Halaman
              </div>
              {LANDING_NAV_ITEMS.map(({ path, id, label, icon: Icon }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    scrollToSection(path, id)
                  }}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                    activePath === path || location.pathname === path
                      ? 'bg-slate-950 text-white shadow-tactile-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}

              <Link
                to="/buyer/properties"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span>Katalog Lengkap (Discovery)</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              {session && role ? (
                <>
                  <Link
                    to={`/${role}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white shadow-tactile-xs"
                  >
                    <User className="h-4 w-4 text-accent" />
                    <span>Buka {role.toUpperCase()} Space</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      signOut()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar dari Akun</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/buyer/properties"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-accent py-2 text-xs font-bold text-slate-950 shadow-tactile-xs hover:bg-accent-hover"
                  >
                    Katalog
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
