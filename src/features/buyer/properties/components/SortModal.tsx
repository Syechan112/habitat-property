import { Check, Sparkles, TrendingDown, TrendingUp, Maximize2 } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

interface SortModalProps {
  isOpen: boolean
  onClose: () => void
  sortBy: string
  onSortChange: (value: string) => void
}

export const SORT_OPTIONS = [
  {
    value: 'recommended',
    label: 'Terkurasi (Rekomendasi Habitat)',
    desc: 'Prioritas kualitas blueprint arsitektur & legalitas terverifikasi',
    icon: Sparkles,
  },
  {
    value: 'price-asc',
    label: 'Harga: Terendah ke Tertinggi',
    desc: 'Mulai dari estimasi nilai investasi paling terjangkau',
    icon: TrendingDown,
  },
  {
    value: 'price-desc',
    label: 'Harga: Tertinggi ke Terendah',
    desc: 'Koleksi hunian ultra-luxury & mahakarya paling prestisius',
    icon: TrendingUp,
  },
  {
    value: 'area-desc',
    label: 'Luas Area Terbesar',
    desc: 'Dimensi luas kavling tanah & bangunan maksimal',
    icon: Maximize2,
  },
]

export default function SortModal({
  isOpen,
  onClose,
  sortBy,
  onSortChange,
}: SortModalProps) {
  const handleSelect = (value: string) => {
    onSortChange(value)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Urutkan Katalog Hunian"
      description="Pilih preferensi pengurutan koleksi properti terkurasi."
      className="max-w-md"
    >
      <div className="space-y-2 pt-1">
        {SORT_OPTIONS.map(({ value, label, desc, icon: Icon }) => {
          const isSelected = sortBy === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-950 bg-slate-950 text-white shadow-tactile-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                    isSelected ? 'bg-white/15 text-accent' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate leading-tight">{label}</p>
                  <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                    {desc}
                  </p>
                </div>
              </div>

              {isSelected && <Check className="h-4 w-4 text-accent shrink-0 ml-2" strokeWidth={3} />}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
