import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { propertyApi, type Property } from "@/services/property-api";
import { useFavoritesStore } from "@/stores/favorites-store";
import {
  FilterBar,
  PropertyCard,
  FloatingComparisonDrawer,
  EmptyState,
} from "./components";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const propertyImage = (property: Property) => {
  const image = property.images[0]?.url;
  if (!image) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80";
  }
  return image.startsWith("http") ? image : `http://localhost:3001${image}`;
};

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "",
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "",
  );
  const [sortBy, setSortBy] = useState("recommended");

  const {
    ids: favoriteIds,
    toggle: toggleFavorite,
    compareIds,
    toggleCompare,
  } = useFavoritesStore();

  const fetchProperties = () => {
    setIsLoading(true);
    setErrorMessage(null);
    propertyApi
      .getProperties()
      .then((data) => {
        setProperties(data.properties);
      })
      .catch((err) => {
        console.error("Error fetching buyer properties:", err);
        setErrorMessage(
          'Tidak dapat menghubungi API server (http://localhost:3001). Pastikan server backend sedang aktif dengan perintah "npm run dev:api".',
        );
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Sync state when URL query params change (e.g. from Hero section)
  useEffect(() => {
    const querySearch = searchParams.get("search") ?? "";
    const queryCity = searchParams.get("city") ?? "";
    const queryType = searchParams.get("type") ?? "";
    setSearch(querySearch);
    setSelectedCity(queryCity);
    setSelectedType(queryType);
  }, [searchParams]);

  const cities = useMemo(
    () =>
      Array.from(new Set(properties.map((p) => p.city).filter(Boolean))).sort(),
    [properties],
  );

  const propertyTypes = useMemo(
    () =>
      Array.from(
        new Set(properties.map((p) => p.propertyType).filter(Boolean)),
      ),
    [properties],
  );

  const filtered = useMemo(() => {
    return properties
      .filter((property) => {
        // Hanya tampilkan properti yang sudah terverifikasi dan berstatus 'available'
        if (property.status !== "available") return false;

        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          `${property.title} ${property.city} ${property.location} ${property.description}`
            .toLowerCase()
            .includes(term);
        const matchesCity =
          !selectedCity ||
          property.city.toLowerCase() === selectedCity.toLowerCase();
        const matchesType =
          !selectedType ||
          property.propertyType.toLowerCase() === selectedType.toLowerCase();
        return matchesSearch && matchesCity && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "area-desc") return b.areaSqft - a.areaSqft;
        return 0;
      });
  }, [properties, search, selectedCity, selectedType, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCity("");
    setSelectedType("");
    setSortBy("recommended");
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas px-6 py-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-accent" />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Memuat Katalog Hunian Terakreditasi…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-10">
        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-rose-900">
                Koneksi Server Terputus
              </p>
              <p className="text-xs text-rose-700">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={fetchProperties}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Coba Hubungkan Lagi
            </button>
          </div>
        )}

        {/* Header Banner */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950">
                Temukan Hunian Mahakarya Anda.
              </h1>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl">
                Setiap properti telah melalui audit blueprint arsitektur,
                verifikasi kepemilikan BPN, dan inspeksi fisik.
              </p>
            </div>

            {compareIds.length > 0 && (
              <Link
                to="/buyer/compare"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-slate-950 shadow-tactile-sm hover:bg-accent-hover transition-all"
              >
                <span>Lihat Komparasi ({compareIds.length}/3)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Interactive Search & Filter Controls */}
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cities={cities}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            propertyTypes={propertyTypes}
            onClearFilters={clearFilters}
            hasActiveFilters={Boolean(
              search ||
              selectedCity ||
              selectedType ||
              sortBy !== "recommended",
            )}
          />
        </section>

        {/* Catalog Results Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Menampilkan {filtered.length} Properti Terkurasi</span>
            {compareIds.length > 0 && (
              <span>{compareIds.length}/3 Terpilih untuk Dibandingkan</span>
            )}
          </div>

          {filtered.length === 0 ?
            <EmptyState onReset={clearFilters} />
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favoriteIds.includes(property.id)}
                  isCompare={compareIds.includes(property.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                  formatPrice={formatPrice}
                  propertyImage={propertyImage}
                />
              ))}
            </div>
          }
        </section>
      </div>

      {/* Floating Bottom Comparison Drawer */}
      <FloatingComparisonDrawer compareCount={compareIds.length} />
    </div>
  );
}
