import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, BedDouble, Ruler, SlidersHorizontal, Heart, Scale, X } from 'lucide-react'
import { propertyApi } from '@/services/property-api'
import type { Property } from '@/services/property-api'
import { useFavoritesStore } from '@/stores/favorites-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(price)

const propertyImage = (property: Property) => {
  const image = property.images[0]?.url
  if (!image) return '/placeholder-property.svg'
  return image.startsWith('http') ? image : 'http://localhost:3001' + image
}

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('newest')
  const { ids: favoriteIds, toggle: toggleFavorite, compareIds, toggleCompare } = useFavoritesStore()

  useEffect(() => {
    let active = true
    propertyApi.getProperties()
      .then((data) => { if (active) setProperties(data.properties) })
      .catch((err: unknown) => {
        console.error('Failed to fetch properties', err)
        if (active) setError('Properti belum bisa dimuat. Pastikan server lokal sedang berjalan.')
      })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  const cities = useMemo(() => Array.from(new Set(properties.map((property) => property.city).filter(Boolean))).sort(), [properties])
  const filtered = useMemo(() => properties.filter((property) => {
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || `${property.title} ${property.city} ${property.location} ${property.description}`.toLowerCase().includes(term)
    const matchesCity = !city || property.city === city
    const matchesType = !type || property.propertyType === type
    const matchesMin = !minPrice || property.price >= Number(minPrice)
    const matchesMax = !maxPrice || property.price <= Number(maxPrice)
    return matchesSearch && matchesCity && matchesType && matchesMin && matchesMax
  }).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : b.id - a.id), [properties, search, city, type, minPrice, maxPrice, sort])

  const hasFilters = search.trim() !== '' || city !== '' || type !== '' || minPrice !== '' || maxPrice !== ''

  const clearFilters = () => {
    setSearch('')
    setCity('')
    setType('')
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
  }

  if (isLoading) return <div className="grid min-h-[400px] place-items-center text-muted-foreground" role="status">Memuat properti…</div>
  if (error) return <div className="grid min-h-[400px] place-items-center"><Card className="max-w-md"><CardContent className="space-y-4 pt-6 text-center"><h2 className="text-xl font-semibold">Properti gagal dimuat</h2><p className="text-muted-foreground">{error}</p><Button onClick={() => window.location.reload()}>Coba lagi</Button></CardContent></Card></div>

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
        <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">HABITAT PROPERTIES</p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">Temukan tempat yang terasa seperti rumah.</h1>
        <p className="mt-4 max-w-xl text-sm text-white/70 sm:text-base">Jelajahi pilihan properti terkurasi untuk langkah hidup berikutnya.</p>
      </section>

      <section className="grid gap-3 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-6" aria-label="Filter properti">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Cari properti" className="pl-9" placeholder="Cari lokasi atau properti" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div>
          <Label className="sr-only" htmlFor="city-filter">Kota</Label>
          <select id="city-filter" className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm" value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">Semua kota</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <Label className="sr-only" htmlFor="type-filter">Tipe properti</Label>
          <select id="type-filter" className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">Semua tipe</option><option value="house">Rumah</option><option value="apartment">Apartemen</option><option value="villa">Villa</option><option value="land">Tanah</option><option value="commercial">Komersial</option>
          </select>
        </div>
        <Input aria-label="Harga minimum" type="number" min="0" placeholder="Harga min. (Rp)" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
        <Input aria-label="Harga maksimum" type="number" min="0" placeholder="Harga maks. (Rp)" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        <div className="flex flex-wrap items-center gap-2 lg:col-span-6">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Label className="sr-only" htmlFor="sort-filter">Urutkan</Label>
          <select id="sort-filter" className="h-9 rounded-md border border-input bg-white px-3 text-sm" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Terbaru</option><option value="price-asc">Harga terendah</option><option value="price-desc">Harga tertinggi</option>
          </select>
          {hasFilters ? <Button variant="ghost" size="sm" onClick={clearFilters}><X className="h-4 w-4" />Hapus filter</Button> : <span className="hidden lg:inline-block" />}
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} properti</span>
        </div>
      </section>

      {compareIds.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary p-4 text-sm"><span>{compareIds.length}/3 properti dipilih untuk perbandingan</span><Link className="font-semibold underline" to="/buyer/compare">Bandingkan pilihan</Link></div>}

      {filtered.length === 0 ? (
        <Card><CardContent className="py-14 text-center"><h2 className="text-lg font-semibold">Properti tidak ditemukan</h2><p className="mt-2 text-sm text-muted-foreground">Ubah kata kunci atau hapus beberapa filter.</p><Button variant="outline" className="mt-4" onClick={clearFilters}>Reset filter</Button></CardContent></Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <Card key={property.id} className="group overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-lg">
              <Link to={`/buyer/properties/${property.id}`} aria-label={`Lihat ${property.title}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={propertyImage(property)} alt={property.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(event) => { event.currentTarget.src = '/placeholder-property.svg' }} />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize">{property.propertyType}</span>
                </div>
              </Link>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3"><CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle><button type="button" aria-label={favoriteIds.includes(property.id) ? 'Hapus dari favorit' : 'Simpan ke favorit'} aria-pressed={favoriteIds.includes(property.id)} onClick={() => toggleFavorite(property.id)} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-primary"><Heart className={`h-4 w-4 ${favoriteIds.includes(property.id) ? 'fill-accent text-accent' : ''}`} /></button></div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}, {property.city}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{formatPrice(property.price)}</p>
                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{property.bedrooms} kamar</span><span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{property.areaSqft} m²</span><button type="button" className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-secondary" aria-pressed={compareIds.includes(property.id)} onClick={() => toggleCompare(property.id)}><Scale className="h-4 w-4" />{compareIds.includes(property.id) ? 'Dipilih' : 'Bandingkan'}</button></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
