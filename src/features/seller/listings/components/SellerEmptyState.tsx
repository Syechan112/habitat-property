import { Building2 } from 'lucide-react'

export default function SellerEmptyState() {
  return (
    <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-4">
      <Building2 className="h-10 w-10 mx-auto text-slate-400" />
      <h3 className="text-lg font-bold text-slate-950">Belum Ada Properti dalam Portofolio</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        Tekan tombol "Daftarkan Hunian" di atas untuk menambahkan properti pertama Anda.
      </p>
    </div>
  )
}
