import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-provider'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import BuyerPropertiesPage from '@/features/buyer/properties/page'
import PropertyDetailPage from '@/features/buyer/properties/detail-page'
import ComparePage from '@/features/buyer/properties/compare-page'

function AuthenticatedLayout() {
  const { session, role } = useAuth()
  const targetRole = window.location.pathname.split('/')[1]

  if (!session || !role) return <Navigate to="/login" replace />
  if (targetRole !== role) return <Navigate to={`/${role}`} replace />
  return <Outlet />
}

function DashboardLayout({ role }: { role: 'buyer' | 'seller' | 'admin' }) {
  const { signOut } = useAuth()

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
        <Outlet />
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
        <Route element={<DashboardLayout role="buyer" />}>
          <Route path="/buyer" element={<BuyerPropertiesPage />} />
          <Route path="/buyer/properties" element={<BuyerPropertiesPage />} />
          <Route path="/buyer/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/buyer/compare" element={<ComparePage />} />
        </Route>
        <Route element={<DashboardLayout role="seller" />}>
          <Route path="/seller" element={<div className="text-center py-10"><h2 className="text-xl font-semibold">Seller Dashboard</h2></div>} />
        </Route>
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin" element={<div className="text-center py-10"><h2 className="text-xl font-semibold">Admin Dashboard</h2></div>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={session && role ? `/${role}` : '/login'} replace />} />
    </Routes>
  )
}

export default function Router() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}