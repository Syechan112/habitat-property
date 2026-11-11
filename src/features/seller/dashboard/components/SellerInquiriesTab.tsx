import { MessageSquare, ShieldCheck } from 'lucide-react'

export default function SellerInquiriesTab() {
  return (
    <div className="rounded-[2.5rem] bg-white border border-slate-200/80 p-10 shadow-tactile-sm text-center space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 mx-auto">
        <MessageSquare className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-950">Inquiry & Jadwal Inspeksi Calon Pembeli</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Setiap kali calon pembeli mengajukan jadwal inspeksi privat pada listing Anda, tim konsultan Habitat akan meneruskan detail kontak dan waktu temu melalui WhatsApp resmi.
      </p>
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
        <ShieldCheck className="h-4 w-4" />
        <span>Notifikasi Otomatis Terhubung ke Nomor Terdaftar</span>
      </div>
    </div>
  )
}
