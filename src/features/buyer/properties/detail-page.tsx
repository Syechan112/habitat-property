import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Heart, SlidersHorizontal, ShieldCheck, Building2 } from 'lucide-react'
import { propertyApi, type Property } from '@/services/property-api'
import { useFavoritesStore } from '@/stores/favorites-store'
import { Button } from '@/components/ui/button'
import { PropertyGallery, PropertySpecs, InquiryCard } from './components'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { ids: favoriteIds, toggle: toggleFavorite, compareIds, toggleCompare } = useFavoritesStore()

  useEffect(() => {
    if (!id) return
    let active = true
    propertyApi
      .getProperty(Number(id))
      .then((item) => {
        if (active) setProperty(item)
      })
      .catch(() => {
        if (active) setError('Properti tidak ditemukan atau telah diarsipkan.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-32 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-accent" />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Mengambil Data Blueprint & Spesifikasi Hunian…
          </p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-32 flex flex-col items-center justify-center text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Building2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-950">{error ?? 'Properti Tidak Ditemukan'}</h2>
        <p className="text-sm text-slate-500 max-w-md">
          Listing ini mungkin telah terjual atau sedang dalam proses verifikasi ulang oleh tim kurator.
        </p>
        <Link to="/buyer/properties">
          <Button variant="outline" className="rounded-full">
            Kembali ke Katalog
          </Button>
        </Link>
      </div>
    )
  }

  const isFav = favoriteIds.includes(property.id)
  const isComp = compareIds.includes(property.id)

  const allImages =
    property.images && property.images.length > 0
      ? property.images.map((img) =>
          img.url.startsWith('http') ? img.url : `http://localhost:3001${img.url}`,
        )
      : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        ]

  return (
    <div className="min-h-screen bg-canvas px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/buyer/properties"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-tactile-xs hover:border-slate-900 transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Katalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(property.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                isComp
                  ? 'border-accent bg-accent text-slate-950 shadow-tactile-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{isComp ? 'Dalam Komparasi' : 'Bandingkan'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(property.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                isFav
                  ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-tactile-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-current text-rose-600' : ''}`} />
              <span>{isFav ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Showcase: Main Gallery & Details (Left) + Inquiry Card (Right) */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Gallery Stage */}
            <PropertyGallery
              property={property}
              allImages={allImages}
              selectedImageIndex={selectedImageIndex}
              onSelectImage={setSelectedImageIndex}
              formatPrice={formatPrice}
            />

            {/* Title & Verification Header */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-tactile-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {property.propertyType} Residence
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Sertifikat Terverifikasi</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-slate-700">
                  {property.location}, {property.city}
                </span>
              </div>
            </div>

            {/* Architectural Specifications Grid */}
            <PropertySpecs
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              areaSqft={property.areaSqft}
            />

            {/* Curatorial Description */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-tactile-sm space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Deskripsi & Keunggulan Arsitektur
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {property.description ||
                  'Hunian ini dirancang dengan presisi tata ruang modern yang mengoptimalkan sirkulasi udara alami dan pencahayaan alami sepanjang hari. Dikelilingi oleh lingkungan yang tenang dan prestisius dengan akses privat terjamin.'}
              </p>
            </div>
          </div>

          {/* Sticky Inquiry & Offer Card */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
            <InquiryCard
              propertyId={property.id}
              price={property.price}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
