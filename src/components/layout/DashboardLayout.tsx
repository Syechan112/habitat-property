import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

interface DashboardLayoutProps {
  role: 'buyer' | 'seller' | 'admin'
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-slate-900">
      <Navbar variant="dashboard" role={role} />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  )
}
