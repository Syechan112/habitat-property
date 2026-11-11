import { useState, type FormEvent } from "react";
import { ArrowRight, MapPin, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CitySelectModal from "./CitySelectModal";

interface HeroSectionProps {
  locationQuery: string;
  selectedCity: string;
  onLocationChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSearch: (event: FormEvent) => void;
}

export default function HeroSection({
  locationQuery,
  selectedCity,
  onLocationChange,
  onCityChange,
  onSearch,
}: HeroSectionProps) {
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-dark"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90')",
        }}
      />

      {/* Image Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/15 to-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-32">
        {/* Eyebrow */}
        <span className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/80 sm:mb-6 sm:text-[10px] sm:tracking-[0.35em]">
          Curated Architectural Living
        </span>

        {/* Heading */}
        <h1 className="max-w-4xl text-balance text-[2rem] font-medium leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Exceptional Living
          <br />
          <span className="font-serif italic">Starts Here.</span>
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:mt-6 sm:text-sm md:text-base">
          Temukan hunian eksklusif dengan arsitektur timeless, lokasi istimewa,
          dan kualitas hidup yang dirancang untuk generasi mendatang.
        </p>

        {/* Search */}
        <form
          onSubmit={onSearch}
          className="mt-6 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl backdrop-blur-xl sm:mt-10 sm:flex-row sm:items-center"
        >
          {/* Location Input */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
            <MapPin className="h-4 w-4 shrink-0 text-emerald sm:h-5 sm:w-5" />
            <input
              value={locationQuery}
              onChange={(event) => onLocationChange(event.target.value)}
              placeholder="Lokasi, nama hunian, atau kawasan..."
              className="w-full bg-transparent text-xs text-dark outline-none placeholder:text-muted sm:text-sm"
            />
          </div>

          {/* City Modal Trigger & Search Button */}
          <div className="flex items-center gap-2 border-t border-border px-2 pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              className="flex h-10 min-w-[130px] sm:min-w-[150px] flex-1 items-center justify-between gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-dark hover:bg-slate-100/70 transition-colors sm:h-11 sm:text-sm cursor-pointer"
              aria-label="Pilih Kota"
            >
              <span className="truncate">{selectedCity || "Semua Kota"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted shrink-0 transition-transform" />
            </button>

            <Button
              type="submit"
              variant="accent"
              className="h-10 shrink-0 gap-1.5 px-4 text-xs sm:h-11 sm:gap-2 sm:px-5 sm:text-sm cursor-pointer"
            >
              Eksplorasi
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </form>

        {/* Modal Pemilihan Kota (Compact & Paginated to List) */}
        <CitySelectModal
          isOpen={isCityModalOpen}
          onClose={() => setIsCityModalOpen(false)}
          selectedCity={selectedCity}
          onSelectCity={onCityChange}
        />

        {/* Trust Indicators */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2.5 text-[9px] font-medium text-white/80 sm:mt-8 sm:gap-x-6 sm:text-xs">
          {[
            "Legalitas Terverifikasi",
            "Inspeksi Virtual 3D",
            "Rekening Bersama",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
