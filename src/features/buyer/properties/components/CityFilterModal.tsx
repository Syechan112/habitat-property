import { useState, useMemo } from 'react'
import { MapPin, Check, ChevronRight, ArrowLeft, Search, Building2 } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

interface CityFilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCity: string
  onSelectCity: (city: string) => void
  catalogCities: string[]
}

const PRESET_CITIES = [
  { value: 'Jakarta Selatan', label: 'Jakarta Selatan', desc: 'Pusat hunian modern SCBD & Kebayoran' },
  { value: 'Bali', label: 'Bali', desc: 'Villa tropis & coastal living Uluwatu' },
  { value: 'Bandung', label: 'Bandung', desc: 'Hunian asri perbukitan Dago Pakar' },
  { value: 'Surabaya', label: 'Surabaya', desc: 'Residensi megah & strategis Graha Famili' },
  { value: 'Tangerang Selatan', label: 'Tangerang Selatan', desc: 'Kawasan modern BSD City & Bintaro' },
  { value: 'Yogyakarta', label: 'Yogyakarta', desc: 'Arsitektur vernakular asri Kaliurang' },
  { value: 'Lombok', label: 'Lombok', desc: 'Residensi pantai & sanctuary privat Senggigi' },
  { value: 'Bekasi', label: 'Bekasi', desc: 'Residensi keluarga Summarecon' },
]

export default function CityFilterModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  catalogCities,
}: CityFilterModalProps) {
  const [showAllList, setShowAllList] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Gabungkan preset kota dengan kota yang ada di data database
  const allCities = useMemo(() => {
    const list = [...PRESET_CITIES]
    for (const c of catalogCities) {
      if (c && !list.some((item) => item.value.toLowerCase() === c.toLowerCase())) {
        list.push({
          value: c,
          label: c,
          desc: 'Kawasan residensi terdaftar',
        })
      }
    }
    return list
  }, [catalogCities])

  const primaryCities = allCities.slice(0, 4)

  const handleSelect = (cityValue: string) => {
    onSelectCity(cityValue)
    onClose()
    setShowAllList(false)
    setSearchQuery('')
  }

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return allCities
    const q = searchQuery.toLowerCase()
    return allCities.filter(
      (c) => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    )
  }, [allCities, searchQuery])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setShowAllList(false)
        setSearchQuery('')
      }}
      title={showAllList ? 'Daftar Wilayah Kota' : 'Pilih Kawasan Kota'}
      description={
        showAllList
          ? 'Pilih kawasan hunian dari seluruh wilayah yang terdaftar.'
          : 'Saring katalog hunian berdasarkan kota pilihan Anda.'
      }
      className="max-w-md"
    >
      <div className="space-y-3 pt-1">
        {!showAllList ? (
          <>
            {/* Opsi Semua Kota */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedCity === ''
                  ? 'border-slate-950 bg-slate-950 text-white shadow-tactile-xs'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-900'
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

            {/* 4 Kota Populer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Kawasan Populer
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Favorit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {primaryCities.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.value.toLowerCase()
                return (
                  <button
                    key={city.value}
                    type="button"
                    onClick={() => handleSelect(city.value)}
                    className={`flex flex-col justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-tactile-sm'
                        : 'border-slate-200 bg-white hover:border-slate-900 text-slate-900'
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
                        {city.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Tombol Lihat Semua Kota */}
            <button
              type="button"
              onClick={() => setShowAllList(true)}
              className="w-full mt-1.5 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Lihat Semua Kawasan ({allCities.length} Kota)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            {/* Header Pencarian & Kembali */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAllList(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Kembali</span>
                </button>
                <span className="text-[10px] font-semibold text-slate-400">
                  {filteredList.length} Kota
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama kota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* List Kota */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
              {filteredList.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.value.toLowerCase()
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
                    {isSelected && <Check className="h-3.5 w-3.5 text-accent shrink-0 ml-2" strokeWidth={3} />}
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
