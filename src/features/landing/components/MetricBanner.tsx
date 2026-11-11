export default function MetricBanner() {
  const items = [
    { stat: 'IDR 3.4T+', label: 'Total Nilai Terkurasi', sub: 'Seluruh portofolio terakreditasi' },
    { stat: '450+', label: 'Hunian Pilihan', sub: 'Verifikasi fisik & legalitas ketat' },
    { stat: '99.4%', label: 'Akurasi Spesifikasi', sub: 'Audit blueprint & dimensi lapangan' },
    { stat: '14 Hari', label: 'Rata-rata Waktu Transaksi', sub: 'Dukungan notaris & kurator privat' },
  ]

  return (
    <section id="metrics" className="relative z-20 border-y border-border bg-white py-10 sm:py-14 shadow-[0_-12px_32px_rgba(0,0,0,0.12)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4 lg:gap-12">
          {items.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-2xl font-black tracking-tight text-dark sm:text-3xl md:text-4xl lg:text-5xl">{item.stat}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-dark sm:text-xs md:text-sm">{item.label}</p>
              <p className="text-[10px] sm:text-xs text-muted leading-relaxed">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}