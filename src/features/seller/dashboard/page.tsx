import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Eye, RefreshCw, Package, Phone, Mail, Clock, MessageSquare } from 'lucide-react'
import { sellerApi, type SellerProperty } from '@/services/seller-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries'>('overview')
  const [properties, setProperties] = useState<SellerProperty[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({ total: 0, available: 0, pending: 0, inquiries: 0, viewing: 0 })

  useEffect(() => {
    let active = true
    Promise.all([sellerApi.getMyProperties(), sellerApi.getInquiries()])
      .then(([props, inquiryRows]) => {
        if (!active) return
        setProperties(props)
        setInquiries(inquiryRows)
        setSummary({
          total: props.length,
          available: props.filter((p) => p.status === 'available').length,
          pending: props.filter((p) => p.status === 'pending').length,
          inquiries: inquiryRows.length,
          viewing: inquiryRows.filter((i) => i.status === 'viewing').length,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
    return () => { active = false }
  }, [])

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  if (loading) return <div className="space-y-6"><SkeletonCard /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => <SkeletonCard key={i} />)}</div></div>

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight">Seller Dashboard</h1><p className="mt-1 text-muted-foreground">Kelola properti dan calon pembeli Anda.</p></div>
        <Link to="/seller/listings" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><PlusCircle className="h-4 w-4" />Tambah properti</Link>
      </section>

      <nav className="border-b border-border" aria-label="Navigasi utama">
        <ol className="-mb-px flex space-x-6">
          {[
            { id: 'overview' as const, label: 'Ringkasan', count: summary.total },
            { id: 'properties' as const, label: 'Properti Saya', count: summary.total },
            { id: 'inquiries' as const, label: 'Inquiry', count: summary.inquiries },
          ].map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center px-3 py-4 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs text-foreground">{tab.count}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {activeTab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total listing', value: summary.total, icon: Package, muted: false },
            { label: 'Tersedia', value: summary.available, icon: Eye, muted: summary.available === 0 },
            { label: 'Menunggu persetujuan', value: summary.pending, icon: RefreshCw, muted: summary.pending === 0 },
            { label: 'Inquiry masuk', value: summary.inquiries, icon: MessageSquare, muted: summary.inquiries === 0 },
          ].map((card) => (
            <Card key={card.label}><CardContent className="pt-6"><div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{card.label}</p><card.icon className={`h-4 w-4 ${card.muted ? 'text-muted-foreground' : 'text-accent'}`} /></div><p className="mt-2 text-3xl font-semibold">{card.value}</p></CardContent></Card>
          ))}
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Daftar Properti</h2><Button variant="outline" size="sm" onClick={() => window.location.reload()}><RefreshCw className="h-4 w-4" /></Button></div>
          {properties.length === 0 ? (
            <Card><CardContent className="py-14 text-center"><p className="text-muted-foreground">Belum ada properti. Buat listing pertama Anda.</p><Link className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" to="/seller/listings"><PlusCircle className="h-4 w-4" />Buat properti</Link></CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id}><CardContent className="p-4"><div className="aspect-[4/3] overflow-hidden rounded-md bg-muted"><img src={property.images[0]?.url ? `http://localhost:3001${property.images[0].url}` : '/placeholder-property.svg'} alt={property.title} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = '/placeholder-property.svg' }} /></div><h3 className="mt-3 line-clamp-1 font-semibold">{property.title}</h3><p className="text-sm text-muted-foreground">{property.location}, {property.city}</p><p className="mt-2 font-semibold">{formatPrice(property.price)}</p><div className="mt-3 flex items-center gap-2"><span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize">{property.status}</span><Link className="ml-auto text-sm text-primary underline" to={`/seller/listings/${property.id}`}>Kelola</Link></div></CardContent></Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Inquiry dari Pembeli</h2><Button variant="outline" size="sm" onClick={() => sellerApi.getInquiries().then(setInquiries)}><RefreshCw className="h-4 w-4" /></Button></div>
          {inquiries.length === 0 ? (
            <Card><CardContent className="py-14 text-center"><p className="text-muted-foreground">Belum ada inquiry masuk.</p></CardContent></Card>
          ) : (
            <div className="grid gap-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id}><CardContent className="p-4"><div className="flex items-start gap-4"><div className="flex-1 space-y-1"><p className="font-semibold">{inquiry.propertyTitle}</p><div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="h-4 w-4" />{inquiry.buyerEmail}</span><span className="flex items-center gap-1"><Phone className="h-4 w-4" />{inquiry.phone}</span><span className="flex items-center gap-1"><Clock className="h-4 w-4" />{inquiry.viewing_date}{inquiry.viewing_time ? ` • ${inquiry.viewing_time}` : ''}</span><span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize">{inquiry.status}</span></div><p className="mt-2 text-sm leading-relaxed">{inquiry.message}</p></div></div></CardContent></Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SkeletonCard() { return <div className="h-24 animate-pulse rounded-xl bg-muted" /> }