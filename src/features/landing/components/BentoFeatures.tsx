import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Maximize2, ShieldCheck, SlidersHorizontal } from 'lucide-react'

export default function BentoFeatures() {
  return (
    <section id="living-pillars" data-section="bento" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto mb-10 sm:mb-16 max-w-2xl space-y-3 sm:space-y-4 text-center">
        <h2 className="text-3xl font-black tracking-tight text-dark sm:text-4xl lg:text-5xl">
          Arsitektur yang Memadukan Estetika & Ketenteraman.
        </h2>
        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-muted">
          Setiap properti diuji melalui 4 dimensi kurasi ketat sebelum dinyatakan layak bergabung ke katalog publik Habitat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
        {/* Card 1: 3D Spatial Walkthrough */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-tactile transition-transform hover:-translate-y-1 sm:rounded-[2.5rem] sm:p-8 lg:p-12 md:col-span-2">
          <div className="relative z-10 max-w-md space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-dark text-accent">
              <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-dark sm:text-2xl lg:text-3xl">
              Inspeksi Spasial 3D Beresolusi 4K
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-muted">
              Jelajahi setiap sudut hunian, pencahayaan alami matahari sepanjang hari, serta sirkulasi silang udara melalui pemindaian laser LiDAR.
            </p>
            <Link to="/buyer/properties" className="inline-flex items-center gap-2 pt-1 text-xs font-bold text-emerald hover:underline">
              Coba Demo Spasial <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="relative mt-6 sm:mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-card-subtle">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80" alt="3D spatial scan preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-dark/50 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
              4K Virtual Tour Ready
            </span>
          </div>
        </div>

        {/* Card 2: Legal Guarantee */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-dark bg-dark p-5 sm:rounded-[2.5rem] sm:p-8 lg:p-10 text-white shadow-tactile-lg transition-transform hover:-translate-y-1">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald/20 blur-3xl" />
          <div className="relative z-10 space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-accent font-bold text-dark">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-xl font-black tracking-tight sm:text-2xl">Garansi Bebas Sengketa & Escrow</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-white/60">
              Pemeriksaan berlapis dari riwayat silsilah tanah, tata ruang BPN, hingga perlindungan dana transaksi di rekening penampung resmi.
            </p>
          </div>
          <div className="relative z-10 mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-white/10 p-3.5 sm:p-4 backdrop-blur">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent">Akreditasi Notaris</p>
            <p className="mt-1 text-xs text-white/70">100% Sertifikat Hak Milik valid dan siap balik nama.</p>
          </div>
        </div>

        {/* Card 3: Biophilic Design */}
        <div className="flex flex-col justify-between rounded-3xl sm:rounded-[2.5rem] border border-border bg-emerald-light p-5 sm:p-8 lg:p-10 shadow-tactile transition-transform hover:-translate-y-1">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald text-accent">
              <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-dark sm:text-2xl">Prinsip Desain Biofilik</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-muted">
              Prioritas kurasi bagi hunian yang memaksimalkan vegetasi alami, peredaman panas tropis, dan efisiensi energi terbarukan.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald">
            <span>Sertifikasi Standar Hijau</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        {/* Card 4: Comparison Engine */}
        <div className="flex flex-col justify-between rounded-3xl sm:rounded-[2.5rem] border border-border bg-white p-5 sm:p-8 lg:p-10 shadow-tactile transition-transform hover:-translate-y-1 md:col-span-2">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-card-subtle text-dark">
                  <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-dark sm:text-2xl">Matriks Komparasi Spasial</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted">
                Bandingkan hingga 3 hunian: harga/m², spesifikasi kamar, hingga rasio ruang hijau.
              </p>
            </div>
            <Link to="/buyer/compare" className="inline-flex w-full sm:w-auto justify-center shrink-0 items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-bold text-dark transition-colors hover:border-dark">
              Buka Matriks <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 rounded-2xl border border-border bg-card-subtle p-3 sm:p-4 text-xs">
            {[
              { name: 'The Glass Pavilion', price: 'IDR 18.5M', spec: '4 Kamar · 450 m²' },
              { name: 'Canggu Zen Villa', price: 'IDR 12.8M', spec: '3 Kamar · 320 m²' },
              { name: 'Senopati Penthouse', price: 'IDR 24.0M', spec: '4 Kamar · 510 m²' },
            ].map((item) => (
              <div key={item.name} className="space-y-1 rounded-xl border border-border bg-white p-3">
                <p className="font-bold text-dark">{item.name}</p>
                <p className="font-extrabold text-emerald">{item.price}</p>
                <p className="text-[10px] text-muted">{item.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}