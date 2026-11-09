import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, RefreshCw, CheckCircle2, Home, MessageSquare, Users, Calendar } from 'lucide-react'
import { adminApi, type AdminUser, type AdminProperty, type AdminInquiry } from '@/services/admin-api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Tab = 'overview' | 'users' | 'approvals' | 'inquiries'

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState({ users: 0, properties: 0, pending: 0, available: 0, inquiries: 0 })
  const [users, setUsers] = useState<AdminUser[]>([])
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [searchProperty, setSearchProperty] = useState('')

  const loadData = () => {
    Promise.all([adminApi.getUsers(), adminApi.getAllProperties(), adminApi.getInquiries()])
      .then(([usersList, props, inquiryList]) => {
        setUsers(usersList)
        setProperties(props)
        setInquiries(inquiryList)
        setStats({
          users: usersList.length,
          properties: props.length,
          pending: props.filter((p) => p.status === 'pending').length,
          available: props.filter((p) => p.status === 'available').length,
          inquiries: inquiryList.length,
        })
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat data'))
  }

  useEffect(() => {
    loadData()
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  const applyStatus = async (fn: () => Promise<any>) => {
    try {
      await fn()
      setMessage('Perubahan berhasil.')
      loadData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const handleApprove = (property: AdminProperty) =>
    applyStatus(() => adminApi.updatePropertyStatus(property.id, 'available'))

  const handleReject = (property: AdminProperty) =>
    applyStatus(() => adminApi.updatePropertyStatus(property.id, 'rejected'))

  const filteredProperties = searchProperty
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(searchProperty.toLowerCase()) ||
          p.city.toLowerCase().includes(searchProperty.toLowerCase()),
      )
    : properties

  const pendingProperties = filteredProperties.filter((p) => p.status === 'pending')

  const tabs = [
    { id: 'overview' as const, label: 'Ringkasan', icon: AlertCircle, count: undefined as number | undefined },
    { id: 'users' as const, label: 'Pengguna', icon: Users, count: stats.users },
    { id: 'approvals' as const, label: 'Persetujuan', icon: CheckCircle2, count: stats.pending },
    { id: 'inquiries' as const, label: 'Inquiry', icon: MessageSquare, count: stats.inquiries },
  ]

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Kelola platform, pengguna, dan daftar properti.</p>
        </div>
        <Button variant="outline" onClick={loadData}><RefreshCw className="h-4 w-4" /></Button>
      </section>

      {message && <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      <nav className="border-b border-border pt-4 pb-2" aria-label="Navigasi admin">
        <ol className="-mb-px flex space-x-6">
          {tabs.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center px-3 py-4 text-sm font-medium transition-colors ${tab === t.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <t.icon className="mr-2 h-4 w-4" />
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs text-white">{t.count}</span>
                )}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {tab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Total Pengguna', value: stats.users, icon: Users, muted: false },
            { label: 'Total Listing', value: stats.properties, icon: Home, muted: false },
            { label: 'Menunggu Persetujuan', value: stats.pending, icon: CheckCircle2, muted: stats.pending === 0 },
            { label: 'Tersedia', value: stats.available, icon: CheckCircle2, muted: stats.available === 0 },
            { label: 'Total Inquiry', value: stats.inquiries, icon: MessageSquare, muted: stats.inquiries === 0 },
          ].map((card) => (
            <Card key={card.label}><CardContent className="pt-6"><div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{card.label}</p><card.icon className={`h-4 w-4 ${card.muted ? 'text-muted-foreground' : 'text-accent'}`} /></div><p className="mt-2 text-3xl font-semibold">{card.value}</p></CardContent></Card>
          ))}
          <Card className="lg:col-span-5"><CardContent className="pt-6"><Link to="/admin/approvals" className="text-sm text-primary underline">Lihat semua listing perlu persetujuan →</Link></CardContent></Card>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Daftar Pengguna ({users.length})</h2>
          {users.length === 0 ? <Card><CardContent className="py-14 text-center text-muted-foreground">Belum ada pengguna.</CardContent></Card> : (
            <div className="grid gap-3">
              {users.map((u) => (
                <Card key={u.id}><CardContent className="p-4 flex items-center gap-4"><div className="flex-1"><p className="font-semibold">{u.email}</p><p className="text-sm text-muted-foreground capitalize">{u.role}</p></div><span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize">{u.role}</span><span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('id-ID')}</span></CardContent></Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Persetujuan Properti</h2></div>
          <Input placeholder="Cari judul atau kota..." value={searchProperty} onChange={(e) => setSearchProperty(e.target.value)} />
          {pendingProperties.length === 0 && !searchProperty ? (
            <Card><CardContent className="py-14 text-center text-muted-foreground">Tidak ada listing menunggu persetujuan.</CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {pendingProperties.map((property) => (
                <Card key={property.id}><CardContent className="p-4"><div className="aspect-[4/3] overflow-hidden rounded-md bg-muted"><img src={property.images[0]?.url ? `http://localhost:3001${property.images[0].url}` : '/placeholder-property.svg'} alt={property.title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-property.svg' }} /></div><h3 className="mt-3 line-clamp-1 font-semibold">{property.title}</h3><p className="text-sm text-muted-foreground">{property.location}, {property.city}</p><p className="text-sm font-semibold">{formatPrice(property.price)}</p><div className="mt-3 flex items-center gap-2"><span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">{property.status}</span><Button size="sm" className="ml-auto" variant="outline" onClick={() => handleApprove(property)}>Approve</Button><Button size="sm" variant="destructive" onClick={() => handleReject(property)}>Reject</Button></div></CardContent></Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Semua Inquiry</h2>
          {inquiries.length === 0 ? <Card><CardContent className="py-14 text-center text-muted-foreground">Belum ada inquiry masuk.</CardContent></Card> : (
            <div className="grid gap-3">
              {inquiries.map((inq) => (
                <Card key={inq.id}><CardContent className="p-4"><div className="flex items-start justify-between gap-4"><div className="flex-1"><p className="font-semibold">{inq.title}</p><div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{inq.buyer_email}</span><span className="flex items-center gap-1"><Home className="h-4 w-4" />{inq.seller_email}</span><span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />{inq.phone}</span>{inq.viewing_date && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{inq.viewing_date}{inq.viewing_time ? ` • ${inq.viewing_time}` : ''}</span>}</div><p className="mt-2 line-clamp-2 text-sm leading-relaxed">{inq.message}</p></div><select className="rounded-md border border-input px-2 py-1 text-xs" value={inq.status} onChange={async (e) => { await applyStatus(() => adminApi.updateInquiryStatus(inq.id, e.target.value)); }}>{'new|contacted|interested|viewing|negotiation|won|lost'.split('|').map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></div></CardContent></Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
