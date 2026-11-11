import { useState } from 'react'
import { Phone, CheckCircle2, ShieldCheck } from 'lucide-react'
import { buyerApi } from '@/services/buyer-api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InquiryCardProps {
  propertyId: number
  price: number
  formatPrice: (price: number) => string
}

export default function InquiryCard({ propertyId, price, formatPrice }: InquiryCardProps) {
  const [phone, setPhone] = useState('')
  const [viewingDate, setViewingDate] = useState('')
  const [viewingTime, setViewingTime] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [inquiryError, setInquiryError] = useState<string | null>(null)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInquiryError(null)
    setIsSubmitting(true)
    try {
      await buyerApi.createInquiry({
        propertyId,
        phone: phone || '+62812000000',
        viewingDate: viewingDate || new Date().toISOString().split('T')[0],
        viewingTime: viewingTime || '14:00',
        message: message || 'Halo, saya tertarik untuk melakukan inspeksi privat pada hunian ini.',
      })
      setSubmitted(true)
    } catch (err: unknown) {
      setInquiryError(err instanceof Error ? err.message : 'Gagal mengirim permintaan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-[2.5rem] p-6 sm:p-8 bg-white border border-slate-200/80 shadow-tactile-lg space-y-6">
      {/* Price Banner */}
      <div className="space-y-1 pb-6 border-b border-slate-100">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Harga Penawaran Resmi
        </p>
        <p className="text-3xl font-black tracking-tight text-slate-950">
          {formatPrice(price)}
        </p>
        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Termasuk Biaya Verifikasi Legalitas & Escrow
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200/80 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-tactile-xs">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950">
            Jadwal Inspeksi Terkirim!
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Tim kurator privat Habitat akan menghubungi Anda melalui WhatsApp untuk mengonfirmasi jam temu dengan perwakilan pemilik.
          </p>
        </div>
      ) : (
        <form onSubmit={handleInquirySubmit} className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-950">Jadwalkan Inspeksi Privat</p>
            <p className="text-xs text-slate-500">
              Ajukan waktu kunjungan langsung ke lokasi properti.
            </p>
          </div>

          {inquiryError && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold">
              {inquiryError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-bold text-slate-500">
              Nomor WhatsApp Aktif
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="Contoh: +62 812-3456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-11 rounded-2xl text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-bold text-slate-500">
                Tanggal
              </Label>
              <Input
                id="date"
                type="date"
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
                className="h-11 rounded-2xl text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="time" className="text-xs font-bold text-slate-500">
                Pukul
              </Label>
              <Input
                id="time"
                type="time"
                value={viewingTime}
                onChange={(e) => setViewingTime(e.target.value)}
                className="h-11 rounded-2xl text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-bold text-slate-500">
              Catatan Tambahan (Opsional)
            </Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Informasi kebutuhan khusus inspeksi..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs outline-none focus:border-slate-900 resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl text-sm font-bold shadow-tactile-sm"
          >
            {isSubmitting ? 'Mengirim Permintaan…' : 'Kirim Permintaan Inspeksi'}
          </Button>
        </form>
      )}

      {/* Trust Box */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Jaminan Kurasi Habitat</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Semua transaksi didampingi notaris rekanan berizin resmi dan dilindungi rekening bersama.
        </p>
      </div>
    </Card>
  )
}
