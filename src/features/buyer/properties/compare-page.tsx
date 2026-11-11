import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favorites-store'
import { propertyApi, type Property } from '@/services/property-api'
import { Button } from '@/components/ui/button'
import { CompareCard, CompareTable, CompareEmptyState } from './components'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

export default function ComparePage() {
  const { compareIds, toggleCompare } = useFavoritesStore()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    propertyApi
      .getProperties()
      .then(({ properties: items }) => {
        setProperties(items.filter((property) => compareIds.includes(property.id)))
      })
      .finally(() => setIsLoading(false))
  }, [compareIds])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-32 flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/buyer/properties"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Katalog</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                Matriks Perbandingan Hunian
              </h1>
              <span className="text-xs font-bold text-slate-500">
                ({properties.length}/3 terpilih)
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              Tinjau perbandingan spesifikasi arsitektur, luas efektif, dan rasio harga untuk membuat keputusan investasi yang tepat.
            </p>
          </div>

          <Link to="/buyer/properties">
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Tambah Hunian Lain</span>
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <CompareEmptyState />
        ) : (
          <div className="space-y-8">
            {/* Cards Showcase Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <CompareCard
                  key={property.id}
                  property={property}
                  onRemove={toggleCompare}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Matrix Comparison Table */}
            <CompareTable properties={properties} formatPrice={formatPrice} />
          </div>
        )}
      </div>
    </div>
  )
}
