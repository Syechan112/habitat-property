import { MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { AdminInquiry } from '@/services/admin-api'

interface AdminInquiriesTabProps {
  inquiries: AdminInquiry[]
}

export default function AdminInquiriesTab({ inquiries }: AdminInquiriesTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-950">
          Aktivitas Permintaan Inspeksi ({inquiries.length})
        </h2>
        <p className="text-xs text-slate-500">
          Riwayat permintaan inspeksi privat yang diajukan oleh calon pembeli kepada seller.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-3">
          <MessageSquare className="h-10 w-10 mx-auto text-slate-400" />
          <h3 className="text-lg font-bold text-slate-950">Belum Ada Inquiry Masuk</h3>
          <p className="text-xs text-slate-500">Aktivitas buyer akan tercatat di sini secara otomatis.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inq) => (
            <Card key={inq.id} className="p-6 rounded-3xl border border-slate-200/80 shadow-tactile-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{inq.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Dari: <strong>{inq.buyer_email}</strong> ({inq.phone}) → Ke: <strong>{inq.seller_email}</strong>
                  </p>
                  {inq.message && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{inq.message}"
                    </p>
                  )}
                </div>

                <div className="text-right text-xs text-slate-400 shrink-0">
                  {inq.viewing_date && (
                    <p className="font-semibold text-slate-700">
                      Jadwal: {inq.viewing_date} {inq.viewing_time}
                    </p>
                  )}
                  <p className="mt-1">ID #{inq.id}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
