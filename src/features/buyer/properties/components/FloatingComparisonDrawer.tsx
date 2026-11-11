import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface FloatingComparisonDrawerProps {
  compareCount: number
}

export default function FloatingComparisonDrawer({ compareCount }: FloatingComparisonDrawerProps) {
  if (compareCount === 0) return null

  return (
    <aside
      aria-label="Matriks Perbandingan Cepat"
      className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-40 max-w-md rounded-3xl border border-slate-900/10 bg-slate-950 text-white p-4 shadow-tactile-xl backdrop-blur-2xl animate-fade-in"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-slate-950 font-black">
            {compareCount}
          </div>
          <div>
            <p className="text-xs font-bold text-white">Matriks Perbandingan</p>
            <p className="text-[11px] text-slate-400">{compareCount}/3 hunian siap dibandingkan</p>
          </div>
        </div>

        <Link
          to="/buyer/compare"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-slate-950 hover:bg-accent-hover transition-colors"
        >
          <span>Bandingkan</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  )
}
