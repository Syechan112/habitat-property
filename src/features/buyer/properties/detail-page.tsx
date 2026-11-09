import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BedDouble, Bath, Ruler, MapPin, Heart, MessageSquare, CalendarDays } from 'lucide-react'
import { propertyApi } from '@/services/property-api'
import type { Property } from '@/services/property-api'
import { useFavoritesStore } from '@/stores/favorites-store'
import { Card, CardContent } from '@/components/ui/card'
import ViewingRequestPage from '@/features/buyer/viewings/page'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { ids, toggle } = useFavoritesStore()

  useEffect(() => {
    if (!id) return
    let active = true
    propertyApi.getProperty(Number(id)).then((item) => { if (active) setProperty(item) }).catch(() => { if (active) setError('Properti tidak ditemukan.') }).finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [id])

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Memuat detail properti…</div>
  if (error || !property) return <div className="py-20 text-center"><p className="text-destructive">{error ?? 'Properti tidak ditemukan.'}</p><Link className="mt-4 inline-block underline" to="/buyer/properties">Kembali ke listing</Link></div>

  const formatPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(property.price)

  return (
    <div className="space-y-6">
      <Link to="/buyer/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />Kembali ke listing</Link>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-muted"><img src={property.images[0]?.url ? `http://localhost:3001${property.images[0].url}` : '/placeholder-property.svg'} alt={property.title} className="aspect-[4/3] w-full object-cover" /></div>
          {property.images.length > 1 && <div className="grid grid-cols-3 gap-3">{property.images.slice(1).map((image) => <img key={image.publicId} src={`http://localhost:3001${image.url}`} alt={`${property.title} photo`} className="aspect-video rounded-lg object-cover" />)}</div>}
          <section className="space-y-3"><h2 className="text-xl font-semibold">Tentang properti</h2><p className="whitespace-pre-line leading-7 text-muted-foreground">{property.description || 'Seller belum menambahkan deskripsi.'}</p></section>
        </div>
        <div className="space-y-5">
          <Card><CardContent className="space-y-6 pt-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-accent">{property.propertyType}</p><h1 className="mt-2 text-3xl font-semibold">{property.title}</h1><p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}, {property.city}</p></div><button type="button" onClick={() => toggle(property.id)} aria-label={ids.includes(property.id) ? 'Hapus favorit' : 'Simpan favorit'} aria-pressed={ids.includes(property.id)} className="rounded-full p-2 hover:bg-secondary"><Heart className={`h-5 w-5 ${ids.includes(property.id) ? 'fill-accent text-accent' : ''}`} /></button></div>
            <p className="text-2xl font-semibold">{formatPrice}</p>
            <div className="grid grid-cols-3 gap-3 border-y border-border py-4 text-sm text-muted-foreground"><span className="flex flex-col gap-1"><BedDouble className="h-4 w-4" />{property.bedrooms} kamar</span><span className="flex flex-col gap-1"><Bath className="h-4 w-4" />{property.bathrooms} mandi</span><span className="flex flex-col gap-1"><Ruler className="h-4 w-4" />{property.areaSqft} m²</span></div>
            <a href="#inquiry" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><MessageSquare className="h-4 w-4" />Kirim inquiry</a>
            <a href="#inquiry" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"><CalendarDays className="h-4 w-4" />Minta jadwal kunjungan</a>
          </CardContent></Card>
          <div id="inquiry"><ViewingRequestPage propertyId={property.id} propertyTitle={property.title} /></div>
        </div>
      </div>
    </div>
  )
}
