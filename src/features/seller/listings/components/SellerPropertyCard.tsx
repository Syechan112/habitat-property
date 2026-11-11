import { Link } from 'react-router-dom'
import { MapPin, Trash2, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { SellerProperty } from '@/services/seller-api'

interface SellerPropertyCardProps {
  property: SellerProperty
  formatPrice: (price: number) => string
  onDelete: (property: SellerProperty) => void
}

export default function SellerPropertyCard({
  property,
  formatPrice,
  onDelete,
}: SellerPropertyCardProps) {
  const imageUrl = property.images[0]?.url
    ? property.images[0].url.startsWith('http')
      ? property.images[0].url
      : `http://localhost:3001${property.images[0].url}`
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'

  const isPending = property.status === 'pending'
  const isAvailable = property.status === 'available'
  const isRejected = property.status === 'rejected'

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-tactile-sm overflow-hidden hover-lift flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
          <span
            className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-tactile-xs ${
              isAvailable
                ? 'bg-emerald-600 text-white'
                : isPending
                ? 'bg-amber-400 text-slate-950'
                : isRejected
                ? 'bg-rose-600 text-white'
                : 'bg-slate-700 text-white'
            }`}
          >
            {isPending && <Clock className="h-3 w-3" />}
            {isAvailable && <CheckCircle2 className="h-3 w-3" />}
            {isRejected && <XCircle className="h-3 w-3" />}
            <span>{isPending ? 'Menunggu Review Admin' : property.status}</span>
          </span>

          <button
            onClick={() => onDelete(property)}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-rose-500 hover:text-white transition-colors shadow-tactile-xs cursor-pointer"
            title="Hapus listing"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <CardContent className="p-6 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950 truncate leading-snug">
              {property.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">
                {property.location}, {property.city}
              </span>
            </p>
          </div>

          <p className="text-2xl font-black text-slate-950">
            {formatPrice(property.price)}
          </p>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-semibold">
            <span>{property.bedrooms} KT · {property.bathrooms} KM</span>
            <span>{property.areaSqft} m²</span>
          </div>
        </CardContent>
      </div>

      <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
              <Clock className="h-3 w-3 text-amber-600" />
              <span>Menunggu Approve Admin</span>
            </span>
          ) : isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Tayang di Katalog Publik</span>
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold">
              <XCircle className="h-3 w-3 text-rose-600" />
              <span>Ditolak oleh Admin</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold uppercase">
              {property.status}
            </span>
          )}
        </div>

        {isAvailable ? (
          <Link
            to={`/buyer/properties/${property.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-800 transition-colors"
          >
            <span>Lihat Publik</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span
            className="text-[11px] font-medium text-slate-400 italic"
            title="Listing ini belum dipublikasikan ke pembeli"
          >
            Belum Publik
          </span>
        )}
      </div>
    </Card>
  )
}
