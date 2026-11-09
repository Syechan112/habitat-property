import { Link } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useEffect, useState } from 'react'
import { propertyApi } from '@/services/property-api'
import type { Property } from '@/services/property-api'
import { Card, CardContent } from '@/components/ui/card'

export default function ComparePage() {
  const { compareIds, toggleCompare } = useFavoritesStore()
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    propertyApi.getProperties().then(({ properties: items }) => {
      setProperties(items.filter((property) => compareIds.includes(property.id)))
    })
  }, [compareIds])

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="space-y-6">
      <Link to="/buyer/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />Kembali ke listing</Link>
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">BUYER TOOLS</p><h1 className="mt-2 text-3xl font-semibold">Bandingkan properti</h1><p className="mt-2 text-muted-foreground">Bandingkan maksimal 3 properti pilihan.</p></div>
      {properties.length === 0 ? <Card><CardContent className="py-14 text-center"><p className="text-muted-foreground">Pilih properti dari listing untuk membandingkan.</p></CardContent></Card> : <div className="grid gap-4 md:grid-cols-3">{properties.map((property) => <Card key={property.id}><CardContent className="space-y-4 p-4"><div className="flex justify-end"><button type="button" onClick={() => toggleCompare(property.id)} aria-label={`Hapus ${property.title}`}><X className="h-4 w-4" /></button></div><img src={property.images[0]?.url ? `http://localhost:3001${property.images[0].url}` : '/placeholder-property.svg'} alt={property.title} className="aspect-video w-full rounded-lg object-cover" /><h2 className="font-semibold">{property.title}</h2><p className="text-lg font-semibold">{formatPrice(property.price)}</p><dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm"><div><dt className="text-muted-foreground">Tipe</dt><dd className="capitalize">{property.propertyType}</dd></div><div><dt className="text-muted-foreground">Lokasi</dt><dd>{property.city}</dd></div><div><dt className="text-muted-foreground">Kamar</dt><dd>{property.bedrooms}</dd></div><div><dt className="text-muted-foreground">Luas</dt><dd>{property.areaSqft} m²</dd></div></dl></CardContent></Card>)}</div>}
    </div>
  )
}
