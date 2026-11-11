import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import type { Property } from '@/services/property-api'

interface CompareCardProps {
  property: Property
  onRemove: (id: number) => void
  formatPrice: (price: number) => string
}

export default function CompareCard({ property, onRemove, formatPrice }: CompareCardProps) {
  const imageUrl = property.images[0]?.url
    ? property.images[0].url.startsWith('http')
      ? property.images[0].url
      : `http://localhost:3001${property.images[0].url}`
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-tactile-sm p-5 space-y-4 flex flex-col justify-between">
      <button
        onClick={() => onRemove(property.id)}
        className="absolute top-7 right-7 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white shadow-tactile-xs hover:bg-rose-600 transition-colors"
        title="Hapus dari perbandingan"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="space-y-3">
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
          <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
            {property.propertyType}
          </span>
          <h3 className="text-lg font-bold text-slate-950 truncate mt-0.5">{property.title}</h3>
          <p className="text-xs text-slate-500">{property.location}, {property.city}</p>
        </div>
        <p className="text-2xl font-black text-slate-950">{formatPrice(property.price)}</p>
      </div>

      <Link
        to={`/buyer/properties/${property.id}`}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-950 hover:text-white transition-colors"
      >
        <span>Inspeksi Rinci</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
