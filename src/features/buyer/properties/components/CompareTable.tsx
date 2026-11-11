import { ShieldCheck } from 'lucide-react'
import type { Property } from '@/services/property-api'

interface CompareTableProps {
  properties: Property[]
  formatPrice: (price: number) => string
}

export default function CompareTable({ properties, formatPrice }: CompareTableProps) {
  const rows = [
    {
      label: 'Harga Penawaran',
      render: (p: Property) => (
        <span className="font-extrabold text-slate-950">{formatPrice(p.price)}</span>
      ),
    },
    {
      label: 'Estimasi Harga per m²',
      render: (p: Property) => {
        const perM2 = p.areaSqft > 0 ? Math.round(p.price / p.areaSqft) : 0
        return (
          <span className="font-semibold text-slate-700">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(perM2)}{' '}
            / m²
          </span>
        )
      },
    },
    {
      label: 'Kamar Tidur',
      render: (p: Property) => (
        <span className="font-bold text-slate-900">{p.bedrooms} Ruang Tidur</span>
      ),
    },
    {
      label: 'Kamar Mandi',
      render: (p: Property) => (
        <span className="font-bold text-slate-900">{p.bathrooms} Ruang Mandi</span>
      ),
    },
    {
      label: 'Luas Bangunan',
      render: (p: Property) => <span className="font-bold text-slate-900">{p.areaSqft} m²</span>,
    },
    {
      label: 'Lokasi & Kota',
      render: (p: Property) => (
        <span className="text-slate-700">
          {p.location}, {p.city}
        </span>
      ),
    },
    {
      label: 'Tipe Properti',
      render: (p: Property) => (
        <span className="capitalize font-semibold text-slate-800">{p.propertyType}</span>
      ),
    },
    {
      label: 'Status Verifikasi',
      render: () => (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          SHM Terakreditasi
        </span>
      ),
    },
  ]

  return (
    <div className="rounded-[2.5rem] bg-white border border-slate-200/80 shadow-tactile-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Rincian Komparasi Matriks
        </span>
        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" /> 100% Data Tervalidasi Kurator
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                <td className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-400 w-1/4 border-r border-slate-100">
                  {row.label}
                </td>
                {properties.map((p) => (
                  <td
                    key={p.id}
                    className="p-4 sm:p-5 font-medium border-r border-slate-100 last:border-r-0"
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
