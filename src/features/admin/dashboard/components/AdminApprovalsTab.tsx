import { CheckCircle2, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AdminProperty } from '@/services/admin-api'

interface AdminApprovalsTabProps {
  pendingApprovals: AdminProperty[]
  formatPrice: (price: number) => string
  onApprove: (id: number) => void
  onReject: (id: number) => void
}

export default function AdminApprovalsTab({
  pendingApprovals,
  formatPrice,
  onApprove,
  onReject,
}: AdminApprovalsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Antrean Moderasi Listing ({pendingApprovals.length})
          </h2>
          <p className="text-xs text-slate-500">
            Periksa kelayakan visual dan deskripsi arsitektural sebelum menayangkan listing.
          </p>
        </div>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-950">Semua Listing Telah Dimoderasi</h3>
          <p className="text-xs text-slate-500">Tidak ada pengajuan properti baru yang tertunda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {pendingApprovals.map((p) => {
            const imageUrl = p.images[0]?.url
              ? p.images[0].url.startsWith('http')
                ? p.images[0].url
                : `http://localhost:3001${p.images[0].url}`
              : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'

            return (
              <Card
                key={p.id}
                className="rounded-3xl border border-slate-200/80 bg-white shadow-tactile-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img src={imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Menunggu Persetujuan
                    </span>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                        {p.propertyType}
                      </span>
                      <h3 className="text-xl font-bold text-slate-950 mt-1">{p.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                        <span>
                          {p.location}, {p.city}
                        </span>
                      </p>
                    </div>

                    <p className="text-2xl font-black text-slate-950">{formatPrice(p.price)}</p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-3">
                      <span>{p.bedrooms} Kamar Tidur</span>
                      <span>•</span>
                      <span>{p.bathrooms} Kamar Mandi</span>
                      <span>•</span>
                      <span>{p.areaSqft} m² Luas</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onReject(p.id)}
                    className="rounded-full"
                  >
                    Tolak
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => onApprove(p.id)}
                    className="rounded-full font-bold px-6 shadow-tactile-xs"
                  >
                    Setujui Listing →
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
