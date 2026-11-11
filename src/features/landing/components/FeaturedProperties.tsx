import { Link } from 'react-router-dom'
import { ArrowRight, Heart, MapPin, SlidersHorizontal } from 'lucide-react'
import type { Property } from '@/services/property-api'

interface FeaturedPropertiesProps {
  properties: Property[]
  selectedType: string
  onTypeChange: (value: string) => void
  favoriteIds: number[]
  compareIds: number[]
  onToggleFavorite: (id: number) => void
  onToggleCompare: (id: number) => void
  formatPrice: (price: number) => string
  propertyImage: (property: Property) => string
}

const TYPES = [
  { id: 'all', label: 'Semua' },
  { id: 'villa', label: 'Vila Tropis' },
  { id: 'house', label: 'Rumah Mewah' },
  { id: 'apartment', label: 'Penthouse' },
]

export default function FeaturedProperties({ properties, selectedType, onTypeChange, favoriteIds, compareIds, onToggleFavorite, onToggleCompare, formatPrice, propertyImage }: FeaturedPropertiesProps) {
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-8 sm:mb-12 flex flex-col justify-between gap-5 sm:gap-6 sm:flex-row sm:items-end">
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-dark sm:text-4xl lg:text-5xl">Hunian Mahakarya Terpilih</h2>
          <p className="max-w-lg text-xs sm:text-sm text-muted">
            Eksplorasi kurasi hunian arsitektur terbaik yang saat ini tersedia untuk inspeksi privat.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 rounded-2xl sm:rounded-full border border-border bg-card-subtle p-1.5">
          {TYPES.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`rounded-xl sm:rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all ${
                selectedType === tab.id ? 'bg-white text-dark shadow-sm' : 'text-muted hover:text-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {properties.slice(0, 6).map((property) => {
          const isFav = favoriteIds.includes(property.id)
          const isComp = compareIds.includes(property.id)

          return (
            <article key={property.id} className="group flex flex-col justify-between overflow-hidden rounded-3xl sm:rounded-[2.2rem] border border-border bg-white shadow-tactile transition-transform hover:-translate-y-1">
              <div>
                <div className="relative aspect-[16/11] overflow-hidden bg-card-subtle">
                  <img src={propertyImage(property)} alt={property.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full border border-white/40 bg-white/70 px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-dark backdrop-blur">
                    {property.propertyType}
                  </span>
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4 flex items-center gap-1.5">
                    <button
                      onClick={(event) => { event.preventDefault(); onToggleCompare(property.id) }}
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/40 backdrop-blur transition-all ${isComp ? 'bg-accent text-dark' : 'bg-white/70 text-muted hover:bg-white'}`}
                      title="Bandingkan properti"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={(event) => { event.preventDefault(); onToggleFavorite(property.id) }}
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/40 backdrop-blur transition-all ${isFav ? 'bg-destructive text-white' : 'bg-white/70 text-muted hover:bg-white'}`}
                      title="Simpan favorit"
                    >
                      <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 flex items-center justify-between text-white">
                    <span className="text-lg sm:text-xl font-black drop-shadow-md">{formatPrice(property.price)}</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 p-5 sm:p-6">
                  <div>
                    <h3 className="line-clamp-1 text-lg sm:text-xl font-bold text-dark transition-colors group-hover:text-emerald">{property.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald" />
                      <span className="line-clamp-1">{property.location}, {property.city}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-y-1 border-y border-border py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold text-muted">
                    <span>{property.bedrooms} KT</span>
                    <span>•</span>
                    <span>{property.bathrooms} KM</span>
                    <span>•</span>
                    <span>{property.areaSqft} m² Luas</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0">
                <Link to={`/buyer/properties/${property.id}`} className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-border bg-card-subtle py-2.5 sm:py-3 text-xs font-bold text-dark transition-all duration-200 hover:bg-dark hover:text-white">
                  <span>Jadwalkan Inspeksi Privat</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 sm:mt-14 text-center">
        <Link to="/buyer/properties" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-dark px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-tactile-lg transition-all hover:bg-dark/90">
          <span>Buka Seluruh Katalog ({properties.length} Hunian)</span>
          <ArrowRight className="h-4 w-4 text-accent" />
        </Link>
      </div>
    </section>
  )
}