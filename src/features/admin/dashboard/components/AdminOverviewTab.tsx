import { Users, Building2, Clock, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AdminProperty } from '@/services/admin-api'

interface AdminOverviewTabProps {
  userCount: number
  availableCount: number
  pendingApprovals: AdminProperty[]
  inquiryCount: number
  onNavigateToApprovals: () => void
}

export default function AdminOverviewTab({
  userCount,
  availableCount,
  pendingApprovals,
  inquiryCount,
  onNavigateToApprovals,
}: AdminOverviewTabProps) {
  const kpis = [
    {
      label: 'Pengguna Terdaftar',
      val: userCount,
      sub: 'Buyer, Seller, & Admin',
      icon: Users,
      color: 'bg-white',
    },
    {
      label: 'Katalog Aktif',
      val: availableCount,
      sub: 'Tayang di discovery',
      icon: Building2,
      color: 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950',
    },
    {
      label: 'Menunggu Kurasi',
      val: pendingApprovals.length,
      sub: 'Perlu verifikasi fisik/legal',
      icon: Clock,
      color: 'bg-amber-50/80 border-amber-200/80 text-amber-950',
    },
    {
      label: 'Total Permintaan Inspeksi',
      val: inquiryCount,
      sub: 'Interaksi aktif buyer',
      icon: MessageSquare,
      color: 'bg-slate-900 text-white',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className={`rounded-3xl border p-6 shadow-tactile-sm ${kpi.color}`}>
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

      {/* Quick Action Queue Banner */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-[2.5rem] bg-slate-950 text-white p-8 sm:p-10 border border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-tactile-lg relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Antrean Prioritas
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              Ada {pendingApprovals.length} Properti Menunggu Tinjauan Anda Hari Ini
            </h3>
            <p className="text-xs text-slate-400">
              Pastikan kelengkapan sertifikat hak milik, izin tata ruang, dan resolusi gambar sesuai standar kurasi.
            </p>
          </div>
          <Button
            variant="accent"
            onClick={onNavigateToApprovals}
            className="rounded-full shrink-0 font-bold"
          >
            Buka Antrean Moderasi →
          </Button>
        </div>
      )}
    </div>
  )
}
