import { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  adminApi,
  type AdminProperty,
  type AdminUser,
  type AdminInquiry,
} from '@/services/admin-api'
import {
  AdminOverviewTab,
  AdminApprovalsTab,
  AdminUsersTab,
  AdminInquiriesTab,
} from './components'

type Tab = 'overview' | 'approvals' | 'users' | 'inquiries'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

export default function AdminDashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab: Tab = useMemo(() => {
    if (location.pathname.startsWith('/admin/approvals')) return 'approvals'
    if (location.pathname.startsWith('/admin/users')) return 'users'
    if (location.pathname.startsWith('/admin/inquiries')) return 'inquiries'
    return 'overview'
  }, [location.pathname])

  const handleTabChange = (t: Tab) => {
    if (t === 'approvals') navigate('/admin/approvals')
    else if (t === 'users') navigate('/admin/users')
    else if (t === 'inquiries') navigate('/admin/inquiries')
    else navigate('/admin')
  }

  const [users, setUsers] = useState<AdminUser[]>([])
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      adminApi.getUsers().catch(() => []),
      adminApi.getAllProperties().catch(() => []),
      adminApi.getInquiries().catch(() => []),
    ])
      .then(([uList, pList, iList]) => {
        setUsers(uList)
        setProperties(pList)
        setInquiries(iList)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const pendingApprovals = properties.filter((p) => p.status === 'pending')
  const availableProperties = properties.filter((p) => p.status === 'available')

  const handleApprove = async (id: number) => {
    try {
      await adminApi.updatePropertyStatus(id, 'available')
      setActionMessage('Listing berhasil disetujui dan kini tayang di katalog publik.')
      loadData()
    } catch (e: unknown) {
      setActionMessage(`Gagal menyetujui: ${e instanceof Error ? e.message : 'Kesalahan sistem'}`)
    }
  }

  const handleReject = async (id: number) => {
    if (!window.confirm('Tolak listing ini dari kurasi Habitat?')) return
    try {
      await adminApi.updatePropertyStatus(id, 'rejected')
      setActionMessage('Listing berhasil ditolak.')
      loadData()
    } catch (e: unknown) {
      setActionMessage(`Gagal menolak: ${e instanceof Error ? e.message : 'Kesalahan sistem'}`)
    }
  }

  const handleDeleteUser = async (userId: number, email: string) => {
    if (!window.confirm(`Hapus pengguna ${email}?`)) return
    try {
      await adminApi.deleteUser(userId)
      setActionMessage(`Pengguna ${email} berhasil dihapus.`)
      loadData()
    } catch (e: unknown) {
      setActionMessage(`Gagal menghapus pengguna: ${e instanceof Error ? e.message : 'Kesalahan sistem'}`)
    }
  }

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-32 flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
              Habitat Command Center
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Audit kepatuhan arsitektural, persetujuan listing properti baru, dan pengawasan interaksi platform.
            </p>
          </div>
        </header>

        {actionMessage && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold text-slate-900 shadow-tactile-xs animate-fade-in">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700">
              Tutup
            </button>
          </div>
        )}

        {/* Navigation Tabs Pill */}  

        {/* Tab Content Views */}
        {activeTab === 'overview' && (
          <AdminOverviewTab
            userCount={users.length}
            availableCount={availableProperties.length}
            pendingApprovals={pendingApprovals}
            inquiryCount={inquiries.length}
            onNavigateToApprovals={() => handleTabChange('approvals')}
          />
        )}

        {activeTab === 'approvals' && (
          <AdminApprovalsTab
            pendingApprovals={pendingApprovals}
            formatPrice={formatPrice}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab
            users={users}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'inquiries' && <AdminInquiriesTab inquiries={inquiries} />}
      </div>
    </div>
  )
}
