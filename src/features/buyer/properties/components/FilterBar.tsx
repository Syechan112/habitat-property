import { useState, useMemo } from 'react'
import { Search, X, MapPin, ChevronDown, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CityFilterModal from './CityFilterModal'
import SortModal from './SortModal'

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  selectedCity: string
  onCityChange: (value: string) => void
  cities: string[]
  sortBy: string
  onSortChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  propertyTypes: string[]
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function FilterBar({
  search,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  sortBy,
  onSortChange,
  selectedType,
  onTypeChange,
  propertyTypes,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const [isCityModalOpen, setIsCityModalOpen] = useState(false)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)

  const currentSortLabel = useMemo(() => {
    switch (sortBy) {
      case 'price-asc':
        return 'Harga: Terendah'
      case 'price-desc':
        return 'Harga: Tertinggi'
      case 'area-desc':
        return 'Luas Terbesar'
      case 'recommended':
      default:
        return 'Urutkan: Terkurasi'
    }
  }, [sortBy])

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-tactile-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            aria-label="Cari hunian"
            placeholder="Cari berdasarkan nama hunian, lokasi, atau kata kunci..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-12 rounded-full border-slate-200 text-sm"
          />
        </div>

        {/* City Filter Trigger (Modal) */}
        <button
          type="button"
          onClick={() => setIsCityModalOpen(true)}
          className="h-12 px-5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer hover:bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-2.5 min-w-[150px]"
          aria-label="Pilih Kawasan Kota"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
            <span className="truncate">{selectedCity || 'Semua Kota'}</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>

        <CityFilterModal
          isOpen={isCityModalOpen}
          onClose={() => setIsCityModalOpen(false)}
          selectedCity={selectedCity}
          onSelectCity={onCityChange}
          catalogCities={cities}
        />

        {/* Sort Filter Trigger (Modal) */}
        <button
          type="button"
          onClick={() => setIsSortModalOpen(true)}
          className="h-12 px-5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer hover:bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-2.5 min-w-[150px]"
          aria-label="Pilih Urutan Katalog"
        >
          <div className="flex items-center gap-2 truncate">
            <ArrowUpDown className="h-4 w-4 text-emerald-700 shrink-0" />
            <span className="truncate">{currentSortLabel}</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>

        <SortModal
          isOpen={isSortModalOpen}
          onClose={() => setIsSortModalOpen(false)}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
      </div>

      {/* Property Type Chips & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
            Tipe Properti:
          </span>
          <button
            onClick={() => onTypeChange('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              !selectedType
                ? 'bg-slate-950 text-white shadow-tactile-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-950'
            }`}
          >
            Semua
          </button>
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                selectedType === type
                  ? 'bg-slate-950 text-white shadow-tactile-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-950'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    </div>
  )
}
