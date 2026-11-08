import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-provider'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'

function AuthenticatedLayout() {
  const { session, role } = useAuth()
  const targetRole = window.location.pathname.split('/')[1]

  if (!session || !role) return <Navigate to="/login" replace />
  if (targetRole !== role) return <Navigate to={`/${role}`} replace />
  return <Outlet />
}

function DashboardLayout({ role }: { role: 'buyer' | 'seller' | 'admin' }) {
  const { signOut } = useAuth()
  const title = role === 'buyer' ? 'Find your place' : role === 'seller' ? 'Seller workspace' : 'Platform overview'

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <a href={`/${role}`} className="font-semibold tracking-tight">HABITAT<span className="text-accent">.</span></a>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">{role}</span>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => signOut()}>Sign out</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">HABITAT PROPERTIES</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">Your {role} dashboard is ready. Continue to property management and discovery.</p>
      </main>
    </div>
  )
}

function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <LoginPage />
    </main>
  )
}

function Register() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <RegisterPage />
    </main>
  )
}

function AppRoutes() {
  const { role, isLoading, session } = useAuth()

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-background"><div className="text-sm text-muted-foreground">Loading...</div></div>
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={session && role ? `/${role}` : '/login'} replace />} />
      <Route path="/login" element={session && role ? <Navigate to={`/${role}`} replace /> : <Login />} />
      <Route path="/register" element={session && role ? <Navigate to={`/${role}`} replace /> : <Register />} />
      <Route element={<AuthenticatedLayout />}>
        <Route path="/buyer/*" element={<DashboardLayout role="buyer" />} />
        <Route path="/seller/*" element={<DashboardLayout role="seller" />} />
        <Route path="/admin/*" element={<DashboardLayout role="admin" />} />
      </Route>
      <Route path="*" element={<Navigate to={session && role ? `/${role}` : '/login'} replace />} />
    </Routes>
  )
}

export default function Router() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}