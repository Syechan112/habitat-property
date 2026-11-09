import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Trash2, RefreshCw } from 'lucide-react'
import { sellerApi, type SellerProperty } from '@/services/seller-api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const emptyForm = { title: '', description: '', price: '', location: '', city: '', propertyType: 'house', bedrooms: '1', bathrooms: '1', areaSqft: '1' }

export default function SellerListingsPage() {
  const [properties, setProperties] = useState<SellerProperty[]>([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadProperties = () => {
    setIsLoading(true)
    sellerApi.getMyProperties().then(setProperties).catch((err) => setError(err.message)).finally(() => setIsLoading(false))
  }

  useEffect(loadProperties, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      await sellerApi.createProperty({ ...form, price: Number(form.price), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), areaSqft: Number(form.areaSqft) })
      setForm(emptyForm)
      setShowForm(false)
      setMessage('Listing berhasil dibuat dan menunggu persetujuan admin.')
      loadProperties()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateStatus = async (property: SellerProperty, status: string) => {
    try {
      await sellerApi.updatePropertyStatus(property.id, status)
      setMessage('Status listing diperbarui.')
      loadProperties()
    } catch (err: any) { setError(err.message) }
  }

  const deleteProperty = async (property: SellerProperty) => {
    if (!window.confirm(`Hapus listing ${property.title}?`)) return
    try {
      await sellerApi.deleteProperty(property.id)
      setMessage('Listing dihapus.')
      loadProperties()
    } catch (err: any) { setError(err.message) }
  }

  if (isLoading) return <div className="grid min-h-[300px] place-items-center text-muted-foreground">Memuat listing...</div>

  return <div className="space-y-6">
    <section className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-semibold">Properti Saya</h1><p className="mt-1 text-muted-foreground">Buat dan kelola listing properti.</p></div><Button onClick={() => setShowForm(!showForm)}><PlusCircle className="h-4 w-4" />{showForm ? 'Tutup form' : 'Tambah properti'}</Button></section>
    {message && <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
    {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {showForm && <Card><CardContent className="pt-6"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Judul" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
      <Field label="Lokasi" value={form.location} onChange={(value) => setForm({ ...form, location: value })} required />
      <Field label="Kota" value={form.city} onChange={(value) => setForm({ ...form, city: value })} required />
      <Field label="Harga (Rp)" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} required />
      <Field label="Kamar tidur" type="number" value={form.bedrooms} onChange={(value) => setForm({ ...form, bedrooms: value })} required />
      <Field label="Kamar mandi" type="number" value={form.bathrooms} onChange={(value) => setForm({ ...form, bathrooms: value })} required />
      <Field label="Luas (m²)" type="number" value={form.areaSqft} onChange={(value) => setForm({ ...form, areaSqft: value })} required />
      <div className="space-y-2"><Label htmlFor="property-type">Tipe properti</Label><select id="property-type" className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm" value={form.propertyType} onChange={(event) => setForm({ ...form, propertyType: event.target.value })}><option value="house">Rumah</option><option value="apartment">Apartemen</option><option value="villa">Villa</option><option value="land">Tanah</option><option value="commercial">Komersial</option></select></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="description">Deskripsi</Label><textarea id="description" required className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
      <Button type="submit" className="sm:col-span-2">Simpan listing</Button>
    </form></CardContent></Card>}
    <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{properties.length} listing</h2><Button variant="outline" size="sm" onClick={loadProperties}><RefreshCw className="h-4 w-4" /></Button></div>
    {properties.length === 0 ? <Card><CardContent className="py-14 text-center text-muted-foreground">Belum ada listing.</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <Card key={property.id}><CardContent className="p-4"><img src={property.images[0]?.url ? `http://localhost:3001${property.images[0].url}` : '/placeholder-property.svg'} alt={property.title} className="aspect-[4/3] w-full rounded-md object-cover" /><h3 className="mt-3 font-semibold">{property.title}</h3><p className="text-sm text-muted-foreground">{property.location}, {property.city}</p><p className="mt-2 font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(property.price)}</p><div className="mt-3 flex items-center justify-between"><select aria-label={`Status ${property.title}`} className="rounded-md border px-2 py-1 text-xs" value={property.status} onChange={(event) => updateStatus(property, event.target.value)}><option value="pending">Pending</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option><option value="archived">Archived</option></select><div className="flex items-center gap-2"><Link className="text-sm text-primary underline" to={`/seller/listings/${property.id}`}>Detail</Link><button type="button" aria-label={`Hapus ${property.title}`} onClick={() => deleteProperty(property)}><Trash2 className="h-4 w-4 text-destructive" /></button></div></div></CardContent></Card>)}</div>}
  </div>
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></div> }
