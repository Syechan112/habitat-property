import { useState, useMemo } from 'react'
import { MapPin, Check, ChevronRight, ArrowLeft, Search, Building2 } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

export interface CityOption {
  value: string
  label: string
  desc: string
  count?: string
}

export const ALL_CITY_OPTIONS: CityOption[] = [
  {
    value: '',
    label: 'Semua Kota',
    desc: 'Seluruh wilayah residensi Indonesia',
    count: 'Katalog Penuh',
  },
  {
    value: 'Jakarta Selatan',
    label: 'Jakarta Selatan',
    desc: 'Pusat hunian modern & kawasan prestisius',
    count: '48 Hunian',
  },
  {
    value: 'Bali',
    label: 'Bali',
    desc: 'Villa tropis & coastal living eksklusif',
    count: '36 Hunian',
  },
  {
    value: 'Bandung',
    label: 'Bandung',
    desc: 'Kawasan Dago & hunian pegunungan asri',
    count: '24 Hunian',
  },
  {
    value: 'Surabaya',
    label: 'Surabaya',
    desc: 'Residensi megah & strategis Jawa Timur',
    count: '18 Hunian',
  },
  {
    value: 'Yogyakarta',
    label: 'Yogyakarta',
    desc: 'Kawasan Kaliurang & arsitektur bernyawa',
    count: '15 Hunian',
  },
  {
    value: 'Lombok',
    label: 'Lombok',
    desc: 'Residensi pantai & sanctuary privat',
    count: '11 Hunian',
  },
  {
    value: 'Medan',
    label: 'Medan',
    desc: 'Kawasan Polonia & sentra residensial utama',
    count: '12 Hunian',
  },
  {
    value: 'Semarang',
    label: 'Semarang',
    desc: 'Kawasan bukit & hunian panorama laut',
    count: '9 Hunian',
  },
]

// 4 kota utama untuk tampilan paginasi ringkas (default)
const PRIMARY_CITIES = ALL_CITY_OPTIONS.slice(1, 5)

interface CitySelectModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCity: string
  onSelectCity: (cityValue: string) => void
}

export default function CitySelectModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}: CitySelectModalProps) {
  const [showAllList, setShowAllList] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelect = (cityValue: string) => {
    onSelectCity(cityValue)
    onClose()
    setShowAllList(false)
    setSearchQuery('')
  }

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return ALL_CITY_OPTIONS
    const q = searchQuery.toLowerCase()
    return ALL_CITY_OPTIONS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setShowAllList(false)
        setSearchQuery('')
      }}
      title={showAllList ? 'Daftar Lengkap Kota' : 'Pilih Kawasan'}
      description={
        showAllList
          ? 'Telusuri seluruh pilihan kota dan wilayah residensi.'
          : 'Pilih kawasan hunian favorit Anda.'
      }
      className="max-w-md"
    >
      <div className="space-y-3.5 pt-1">
        {!showAllList ? (
          // ================= VIEW 1: PAGINATED / 4 KOTA UTAMA =================
          <>
            {/* Opsi Default: Semua Kota */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedCity === ''
                  ? 'border-slate-950 bg-slate-950 text-white shadow-tactile-xs'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    selectedCity === '' ? 'bg-white/10 text-accent' : 'bg-white text-slate-700 shadow-tactile-xs'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Semua Kota</p>
                  <p className={`text-[10px] ${selectedCity === '' ? 'text-white/70' : 'text-slate-400'}`}>
                    Seluruh wilayah residensi Indonesia
                  </p>
                </div>
              </div>
              {selectedCity === '' && <Check className="h-4 w-4 text-accent mr-1" strokeWidth={3} />}
            </button>

            {/* Header Mini 4 Kota Populer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                4 Kota Populer
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Terfavorit
              </span>
            </div>

            {/* Grid 4 Kota */}
            <div className="grid grid-cols-2 gap-2.5">
              {PRIMARY_CITIES.map((city) => {
                const isSelected = selectedCity === city.value
                return (
                  <button
                    key={city.value}
                    type="button"
                    onClick={() => handleSelect(city.value)}
                    className={`flex flex-col justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-tactile-sm'
                        : 'border-slate-200 bg-white hover:border-slate-900 hover:shadow-tactile-xs text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          isSelected ? 'bg-white/15 text-accent' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold truncate leading-tight">{city.label}</p>
                      <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                        {city.count}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Tombol Lihat Semuanya (Paginate to List View) */}
            <button
              type="button"
              onClick={() => setShowAllList(true)}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <span>Lihat Semua Kota ({ALL_CITY_OPTIONS.length - 1} Wilayah)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          // ================= VIEW 2: LIST VIEW KETIKA LIHAT SEMUANYA =================
          <>
            {/* Navigasi Kembali ke 4 Kota + Search Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAllList(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Kembali ke 4 Kota Populer</span>
                </button>
                <span className="text-[10px] font-semibold text-slate-400">
                  {filteredList.length} Kota
                </span>
              </div>

              {/* Pencarian Cepat Kota */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama kota atau kawasan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* List Format (Scrollable) */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {filteredList.map((city) => {
                const isSelected = selectedCity === city.value
                return (
                  <button
                    key={city.value}
                    type="button"
                    onClick={() => handleSelect(city.value)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-white'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                          isSelected ? 'bg-white/10 text-accent' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">{city.label}</p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                          {city.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {city.count && (
                        <span
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {city.count}
                        </span>
                      )}
                      {isSelected && <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}

              {filteredList.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  Tidak ada kota yang cocok dengan "{searchQuery}".
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
