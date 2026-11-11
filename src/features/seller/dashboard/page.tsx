import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { sellerApi, type SellerProperty } from '@/services/seller-api'
import { Button } from '@/components/ui/button'
import {
  SellerOverviewTab,
  SellerPropertiesTab,
  SellerInquiriesTab,
} from './components'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

export default function SellerDashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [internalTab, setInternalTab] = useState<'overview' | 'properties' | 'inquiries'>('overview')

  const activeTab = useMemo<'overview' | 'properties' | 'inquiries'>(() => {
    if (location.pathname.startsWith('/seller/inquiries')) return 'inquiries'
    return internalTab
  }, [location.pathname, internalTab])

  const handleTabChange = (t: 'overview' | 'properties' | 'inquiries') => {
    setInternalTab(t)
    if (t === 'inquiries') {
      navigate('/seller/inquiries')
    } else if (location.pathname !== '/seller') {
      navigate('/seller')
    }
  }

  const [properties, setProperties] = useState<SellerProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sellerApi
      .getMyProperties()
      .then((data) => {
        if (active) setProperties(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const summary = {
    total: properties.length,
    available: properties.filter((p) => p.status === 'available').length,
    pending: properties.filter((p) => p.status === 'pending').length,
    reserved: properties.filter((p) => p.status === 'reserved').length,
    sold: properties.filter((p) => p.status === 'sold').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-32 flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
              Workspace Kurasi Portofolio
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Pantau status peninjauan kurator Habitat, kelola data blueprint arsitektur, dan tanggapi calon pembeli privat.
            </p>
          </div>

          <Link to="/seller/listings">
            <Button variant="accent" size="lg" className="rounded-2xl gap-2 font-bold shadow-tactile-sm">
              <Plus className="h-4 w-4" />
              <span>Daftarkan Hunian Baru</span>
            </Button>
          </Link>
        </header>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-slate-100 border border-slate-200/80 w-fit">
          {[
            { id: 'overview', label: 'Ringkasan Eksekutif' },
            { id: 'properties', label: `Portofolio Aktif (${properties.length})` },
            { id: 'inquiries', label: 'Permintaan Inspeksi' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white text-slate-950 shadow-tactile-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && <SellerOverviewTab summary={summary} />}
        {activeTab === 'properties' && (
          <SellerPropertiesTab properties={properties} formatPrice={formatPrice} />
        )}
        {activeTab === 'inquiries' && <SellerInquiriesTab />}
      </div>
    </div>
  )
}
