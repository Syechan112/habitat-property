import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Layers, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SellerOverviewTabProps {
  summary: {
    total: number
    available: number
    pending: number
    reserved: number
    sold: number
  }
}

export default function SellerOverviewTab({ summary }: SellerOverviewTabProps) {
  const kpis = [
    {
      label: 'Total Portofolio',
      val: summary.total,
      sub: 'Unit terdaftar',
      icon: Layers,
      color: 'bg-white text-slate-950',
    },
    {
      label: 'Aktif di Katalog',
      val: summary.available,
      sub: 'Terverifikasi & tayang publik',
      icon: CheckCircle2,
      color: 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80',
    },
    {
      label: 'Proses Kurasi',
      val: summary.pending,
      sub: 'Audit fisik & legalitas',
      icon: Clock,
      color: 'bg-amber-50/80 text-amber-900 border-amber-200/80',
    },
    {
      label: 'Terjual / Dipesan',
      val: summary.reserved + summary.sold,
      sub: 'Transaksi berhasil',
      icon: TrendingUp,
      color: 'bg-slate-900 text-white',
    },
  ]

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card
            key={idx}
            className={`rounded-3xl border shadow-tactile-sm p-6 hover-lift flex flex-col justify-between ${kpi.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                {kpi.label}
              </span>
              <kpi.icon className="h-5 w-5 opacity-70" />
            </div>
            <div className="mt-6">
              <p className="text-4xl font-black tracking-tight">{kpi.val}</p>
              <p className="text-xs opacity-70 mt-1">{kpi.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Action & Guidance Banner */}
      <div className="rounded-[2.5rem] bg-slate-950 text-white p-8 sm:p-10 border border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-tactile-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-accent text-slate-950 text-[10px] font-black uppercase tracking-widest">
            Panduan Listing
          </span>
          <h3 className="text-2xl font-black tracking-tight">
            Maksimalkan Potensi Konversi Hunian Anda
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hunian dengan data dimensi lengkap dan foto beresolusi tinggi mendapatkan 4x lebih banyak permintaan inspeksi privat dari pembeli terverifikasi.
          </p>
        </div>

        <Link to="/seller/listings" className="relative z-10 shrink-0">
          <Button variant="accent" size="default" className="rounded-full">
            Kelola Daftar Properti →
          </Button>
        </Link>
      </div>
    </div>
  )
}
