import { Link } from 'react-router-dom'
import { ArrowRight, Heart, MapPin, SlidersHorizontal } from 'lucide-react'
import type { Property } from '@/services/property-api'

interface PropertyCardProps {
  property: Property
  isFavorite: boolean
  isCompare: boolean
  onToggleFavorite: (id: number) => void
  onToggleCompare: (id: number) => void
  formatPrice: (price: number) => string
  propertyImage: (property: Property) => string
}

export default function PropertyCard({
  property,
  isFavorite,
  isCompare,
  onToggleFavorite,
  onToggleCompare,
  formatPrice,
  propertyImage,
}: PropertyCardProps) {
  return (
    <article className="group rounded-[2.2rem] bg-white border border-slate-200/80 shadow-tactile-sm hover-lift overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image Stage */}
        <div className="relative aspect-[16/11] bg-slate-100 overflow-hidden">
          <img
            src={propertyImage(property)}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Property Type Badge */}
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
            {property.propertyType}
          </span>

          {/* Top Right Action Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleCompare(property.id)
              }}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                isCompare
                  ? 'bg-accent text-slate-950 font-bold shadow-tactile-xs'
                  : 'glass-panel text-slate-700 hover:bg-white'
              }`}
              title={isCompare ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(property.id)
              }}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-tactile-xs'
                  : 'glass-panel text-slate-700 hover:bg-white'
              }`}
              title={isFavorite ? 'Hapus favorit' : 'Simpan favorit'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xl font-black drop-shadow-md">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        {/* Content Card */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950 line-clamp-1 group-hover:text-emerald-800 transition-colors">
              {property.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                {property.location}, {property.city}
              </span>
            </p>
          </div>

          {/* Specs Row */}
          <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs font-semibold text-slate-600">
            <span>{property.bedrooms} Kamar Tidur</span>
            <span>•</span>
            <span>{property.bathrooms} Kamar Mandi</span>
            <span>•</span>
            <span>{property.areaSqft} m² Luas</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-0">
        <Link
          to={`/buyer/properties/${property.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 py-3 text-xs font-bold text-slate-900 hover:bg-slate-950 hover:text-white transition-all duration-200"
        >
          <span>Inspeksi Rinci</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
