import { BedDouble, Bath, Ruler } from 'lucide-react'

interface PropertySpecsProps {
  bedrooms: number
  bathrooms: number
  areaSqft: number
}

export default function PropertySpecs({ bedrooms, bathrooms, areaSqft }: PropertySpecsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-tactile-xs text-center space-y-1">
        <BedDouble className="h-6 w-6 mx-auto text-emerald-700 mb-1" />
        <p className="text-2xl font-black text-slate-950">{bedrooms}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Kamar Tidur
        </p>
      </div>

      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-tactile-xs text-center space-y-1">
        <Bath className="h-6 w-6 mx-auto text-emerald-700 mb-1" />
        <p className="text-2xl font-black text-slate-950">{bathrooms}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Kamar Mandi
        </p>
      </div>

      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-tactile-xs text-center space-y-1">
        <Ruler className="h-6 w-6 mx-auto text-emerald-700 mb-1" />
        <p className="text-2xl font-black text-slate-950">{areaSqft}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Luas m² Bangunan
        </p>
      </div>
    </div>
  )
}
