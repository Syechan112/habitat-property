import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RoleMismatchFeedback } from '@/components/feedback'
import { useAuth } from '@/app/providers/auth-provider'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import BuyerPropertiesPage from '@/features/buyer/properties/page'
import PropertyDetailPage from '@/features/buyer/properties/detail-page'
import ComparePage from '@/features/buyer/properties/compare-page'
import SellerDashboardPage from '@/features/seller/dashboard/page'
import SellerListingsPage from '@/features/seller/listings/page'
import AdminDashboardPage from '@/features/admin/dashboard/page'
import LandingPage from '@/features/landing/page'
import { Header, Footer } from '@/components/layout'
import DashboardLayout from '@/components/layout/DashboardLayout'

function AuthenticatedGuard() {
  const { session, role } = useAuth()
  const location = useLocation()
  const targetRole = location.pathname.split('/')[1]
  const [showMismatch, setShowMismatch] = useState(false)

  useEffect(() => {
    if (session && role && targetRole && targetRole !== role) {
      setShowMismatch(true)
    } else {
      setShowMismatch(false)
    }
  }, [session, role, targetRole])

  if (!session || !role) return <Navigate to="/login" replace />

  if (targetRole !== role) {
    return (
      <RoleMismatchFeedback
        isOpen={showMismatch}
        targetRole={targetRole}
        onClose={() => setShowMismatch(false)}
      />
    )
  }

  return <Outlet />
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  const { role, isLoading, session } = useAuth()

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/architecture" element={<LandingPage />} />
        <Route path="/living-pillars" element={<LandingPage />} />
        <Route path="/bento" element={<LandingPage />} />
        <Route path="/metrics" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route
        path="/login"
        element={session && role ? <Navigate to={`/${role}`} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={session && role ? <Navigate to={`/${role}`} replace /> : <RegisterPage />}
      />

      {/* Authenticated Routes */}
      <Route element={<AuthenticatedGuard />}>
        <Route element={<DashboardLayout role="buyer" />}>
          <Route path="/buyer" element={<Navigate to="/buyer/properties" replace />} />
          <Route path="/buyer/properties" element={<BuyerPropertiesPage />} />
          <Route path="/buyer/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/buyer/compare" element={<ComparePage />} />
        </Route>
        <Route element={<DashboardLayout role="seller" />}>
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/inquiries" element={<SellerDashboardPage />} />
          <Route path="/seller/listings" element={<SellerListingsPage />} />
          <Route path="/seller/listings/:id" element={<SellerListingsPage />} />
          <Route path="/seller/listings/new" element={<SellerListingsPage />} />
        </Route>
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminDashboardPage />} />
          <Route path="/admin/approvals" element={<AdminDashboardPage />} />
          <Route path="/admin/inquiries" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={session && role ? `/${role}` : '/'} replace />} />
    </Routes>
  )
}

export default function Router() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}