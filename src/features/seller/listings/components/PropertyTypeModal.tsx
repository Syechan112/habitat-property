import { Check, Home, Building2, Building, TreePine, Store } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

interface PropertyTypeModalProps {
  isOpen: boolean
  onClose: () => void
  selectedType: string
  onSelectType: (type: string) => void
}

export const PROPERTY_TYPES = [
  {
    value: 'villa',
    label: 'Vila Tropis Mewah',
    desc: 'Estetika coastal resort, infinity pool & sanctuary privat',
    icon: TreePine,
  },
  {
    value: 'house',
    label: 'Rumah Minimalis Modern',
    desc: 'Residensi urban kontemporer dengan tata ruang fungsional',
    icon: Home,
  },
  {
    value: 'apartment',
    label: 'Penthouse / Kondominium',
    desc: 'Hunian lantai tinggi dengan panorama lanskap cakrawala kota',
    icon: Building2,
  },
  {
    value: 'commercial',
    label: 'Ruang Komersial Arsitektural',
    desc: 'Boutique office, gallery, pavilion & ruang kerja terpadu',
    icon: Store,
  },
  {
    value: 'land',
    label: 'Kavling Tanah Eksklusif',
    desc: 'Lahan prima siap bangun di kawasan residensial prestisius',
    icon: Building,
  },
]

export default function PropertyTypeModal({
  isOpen,
  onClose,
  selectedType,
  onSelectType,
}: PropertyTypeModalProps) {
  const handleSelect = (value: string) => {
    onSelectType(value)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Tipe Arsitektur"
      description="Tentukan klasifikasi arsitektural untuk listing hunian ini."
      className="max-w-md"
    >
      <div className="space-y-2 pt-1">
        {PROPERTY_TYPES.map(({ value, label, desc, icon: Icon }) => {
          const isSelected = selectedType.toLowerCase() === value.toLowerCase()
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
