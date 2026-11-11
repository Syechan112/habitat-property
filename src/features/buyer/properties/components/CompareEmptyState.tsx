import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CompareEmptyState() {
  return (
    <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Building2 className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-950">Belum Ada Properti yang Dipilih</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        Pilih hingga 3 hunian dari katalog discovery untuk melihat analisis matriks komparasi berdampingan.
      </p>
      <Link to="/buyer/properties">
        <Button variant="default" size="default" className="rounded-full">
          Jelajahi Katalog Hunian
        </Button>
      </Link>
    </div>
  )
}
