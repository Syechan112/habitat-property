import { Link } from 'react-router-dom'
import { Plus, Building2, MapPin, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SellerProperty } from '@/services/seller-api'

interface SellerPropertiesTabProps {
  properties: SellerProperty[]
  formatPrice: (price: number) => string
}

export default function SellerPropertiesTab({ properties, formatPrice }: SellerPropertiesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-950">Daftar Hunian Anda</h2>
        <Link to="/seller/listings">
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Hunian</span>
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center space-y-4">
          <Building2 className="h-10 w-10 mx-auto text-slate-400" />
          <h3 className="text-lg font-bold text-slate-950">Belum Ada Hunian Terdaftar</h3>
          <p className="text-xs text-slate-500">Mulai daftarkan properti pertama Anda untuk dikurasi.</p>
          <Link to="/seller/listings">
            <Button variant="default" size="sm" className="rounded-full">
              Buat Listing Baru
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <Card
              key={p.id}
              className="rounded-3xl border border-slate-200/80 shadow-tactile-sm overflow-hidden hover-lift flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={
                      p.images[0]?.url
                        ? p.images[0].url.startsWith('http')
                          ? p.images[0].url
                          : `http://localhost:3001${p.images[0].url}`
                        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-tactile-xs ${
                      p.status === 'available'
                        ? 'bg-emerald-600 text-white'
                        : p.status === 'pending'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {p.status === 'pending' ? 'Menunggu Kurasi' : p.status}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-slate-950 truncate">{p.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                    <span>
                      {p.location}, {p.city}
                    </span>
                  </p>
                  <p className="text-xl font-black text-slate-950 pt-2">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {p.bedrooms} KT · {p.bathrooms} KM · {p.areaSqft} m²
                </span>
                <Link
                  to="/seller/listings"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-800"
                >
                  <span>Kelola</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
