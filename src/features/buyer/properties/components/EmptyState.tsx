import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onReset: () => void
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Building2 className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-950">Tidak Ada Hunian yang Sesuai Filter</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        Coba sesuaikan kata kunci pencarian, ubah kota, atau reset filter untuk melihat katalog lengkap.
      </p>
      <Button onClick={onReset} variant="outline" size="sm" className="rounded-full">
        Reset Semua Filter
      </Button>
    </div>
  )
}
