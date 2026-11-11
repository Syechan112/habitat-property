import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function ClosingCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[3rem] bg-dark p-6 sm:p-12 lg:p-20 shadow-tactile-xl">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl space-y-4 sm:space-y-6 text-center text-white">
          <h2 className="text-2xl font-black leading-[1.08] sm:leading-[1.02] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Wujudkan Standar Hunian Impian Anda Bersama Habitat.
          </h2>
          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-white/70 sm:text-lg">
            Baik Anda mencari peristirahatan privat dengan arsitektur mahakarya atau ingin memasarkan properti berkelas kepada pembeli selektif dunia.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link to="/buyer/properties" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-dark transition-all hover:bg-lime-hover">
              <span>Jelajahi Katalog Lengkap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-dark">
              <span>Daftarkan Properti Anda</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}