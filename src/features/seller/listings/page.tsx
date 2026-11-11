import { type FormEvent, useEffect, useState } from 'react'
import { Plus, CheckCircle2, X, ShieldAlert } from 'lucide-react'
import { sellerApi, type SellerProperty } from '@/services/seller-api'
import { Button } from '@/components/ui/button'
import {
  ListingFormCard,
  SellerPropertyCard,
  SellerEmptyState,
  type PropertyFormData,
} from './components'

const emptyForm: PropertyFormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  city: '',
  propertyType: 'villa',
  bedrooms: '3',
  bathrooms: '3',
  areaSqft: '350',
  images: [],
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

export default function SellerListingsPage() {
  const [properties, setProperties] = useState<SellerProperty[]>([])
  const [form, setForm] = useState<PropertyFormData>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadProperties = () => {
    sellerApi
      .getMyProperties()
      .then(setProperties)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      await sellerApi.createProperty({
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        areaSqft: Number(form.areaSqft),
        images: form.images,
      })
      setForm(emptyForm)
      setShowForm(false)
      setMessage('Listing berhasil diajukan dan sedang dalam proses moderasi kurator.')
      loadProperties()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengajukan listing')
    }
  }

  const deleteProperty = async (property: SellerProperty) => {
    if (!window.confirm(`Hapus listing "${property.title}" secara permanen?`)) return
    try {
      await sellerApi.deleteProperty(property.id)
      setMessage(`Listing "${property.title}" berhasil dihapus.`)
      loadProperties()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus listing')
    }
  }

  if (isLoading) {
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
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
              Kelola Daftar Hunian
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Daftarkan hunian baru dan pantau status moderasi persetujuan kurator Admin Habitat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="accent"
              size="default"
              onClick={() => setShowForm(!showForm)}
              className="rounded-full gap-2 font-bold shadow-tactile-sm"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showForm ? 'Tutup Formulir' : 'Daftarkan Hunian'}</span>
            </Button>
          </div>
        </section>

        {/* Notifications */}
        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-tactile-xs animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-900 shadow-tactile-xs animate-fade-in">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Creation Form */}
        {showForm && (
          <ListingFormCard
            form={form}
            onChange={setForm}
            onSubmit={submit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Listings Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">
              Koleksi Properti Terdaftar ({properties.length})
            </h2>
          </div>

          {properties.length === 0 ? (
            <SellerEmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <SellerPropertyCard
                  key={property.id}
                  property={property}
                  formatPrice={formatPrice}
                  onDelete={deleteProperty}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
