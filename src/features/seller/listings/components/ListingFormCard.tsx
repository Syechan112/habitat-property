import { useState, type FormEvent } from 'react'
import { ChevronDown, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UploadedImageResult } from '@/services/seller-api'
import PropertyImageUploader from './PropertyImageUploader'
import PropertyTypeModal, { PROPERTY_TYPES } from './PropertyTypeModal'

export interface PropertyFormData {
  title: string
  description: string
  price: string
  location: string
  city: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  areaSqft: string
  images: UploadedImageResult[]
}

interface ListingFormCardProps {
  form: PropertyFormData
  onChange: (form: PropertyFormData) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
}

export default function ListingFormCard({
  form,
  onChange,
  onSubmit,
  onCancel,
}: ListingFormCardProps) {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const currentTypeLabel =
    PROPERTY_TYPES.find((t) => t.value.toLowerCase() === form.propertyType.toLowerCase())?.label ||
    'Pilih Tipe Arsitektur'

  return (
    <Card className="rounded-[2.5rem] border border-slate-200/90 bg-white p-8 sm:p-10 shadow-tactile-lg space-y-6 animate-fade-in">
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Formulir Pendaftaran Properti Baru
        </h2>
        <p className="text-xs text-slate-500">
          Isi spesifikasi arsitektur hunian dengan presisi. Data akan ditinjau oleh kurator sebelum dipublikasikan.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">Judul Properti</Label>
          <Input id="title" placeholder="Contoh: The Glass Pavilion Sanctuary" value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-slate-500">Alamat / Kawasan</Label>
          <Input id="location" placeholder="Contoh: Jl. Raya Sayan, Ubud" value={form.location} onChange={(e) => onChange({ ...form, location: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kota / Wilayah</Label>
          <Input id="city" placeholder="Contoh: Bali" value={form.city} onChange={(e) => onChange({ ...form, city: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-slate-500">Harga Penawaran (IDR)</Label>
          <Input id="price" type="number" placeholder="Contoh: 18500000000" value={form.price} onChange={(e) => onChange({ ...form, price: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type-button" className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipe Arsitektur</Label>
          <button
            id="type-button"
            type="button"
            onClick={() => setIsTypeModalOpen(true)}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none hover:border-slate-400 focus:border-slate-900 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Building2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span className="truncate">{currentTypeLabel}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>
          <PropertyTypeModal
            isOpen={isTypeModalOpen}
            onClose={() => setIsTypeModalOpen(false)}
            selectedType={form.propertyType}
            onSelectType={(newType) => onChange({ ...form, propertyType: newType })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Kamar Tidur</Label>
          <Input id="bedrooms" type="number" value={form.bedrooms} onChange={(e) => onChange({ ...form, bedrooms: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Kamar Mandi</Label>
          <Input id="bathrooms" type="number" value={form.bathrooms} onChange={(e) => onChange({ ...form, bathrooms: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="area" className="text-xs font-bold uppercase tracking-wider text-slate-500">Luas Efektif Bangunan (m²)</Label>
          <Input id="area" type="number" value={form.areaSqft} onChange={(e) => onChange({ ...form, areaSqft: e.target.value })} required className="rounded-2xl h-12" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deskripsi & Keunggulan Desain
          </Label>
          <textarea
            id="desc"
            rows={4}
            placeholder="Jelaskan konsep arsitektur, orientasi matahari, material yang digunakan, dan fasilitas premium..."
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            required
            className="w-full rounded-2xl border border-slate-200 p-4 text-xs outline-none focus:border-slate-900 resize-none"
          />
        </div>

        <PropertyImageUploader
          images={form.images || []}
          onChange={(images) => onChange({ ...form, images })}
        />

        <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-full"
          >
            Batal
          </Button>
          <Button type="submit" variant="accent" className="rounded-full px-8 font-bold">
            Kirim untuk Kurasi
          </Button>
        </div>
      </form>
    </Card>
  )
}
