import { Sparkles } from 'lucide-react'
import type { Property } from '@/services/property-api'

interface PropertyGalleryProps {
  property: Property
  allImages: string[]
  selectedImageIndex: number
  onSelectImage: (index: number) => void
  formatPrice: (price: number) => string
}

export default function PropertyGallery({
  property,
  allImages,
  selectedImageIndex,
  onSelectImage,
  formatPrice,
}: PropertyGalleryProps) {
  const currentMainImage = allImages[selectedImageIndex] || allImages[0]

  return (
    <div className="space-y-4">
      {/* Main Image Showcase */}
      <div className="relative aspect-[16/10] rounded-[2.5rem] bg-slate-950 overflow-hidden shadow-tactile-xl border border-slate-200/80 group">
        <img
          src={currentMainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-dark text-white text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>Koleksi Pilihan Arsitek</span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
          <div>
            <span className="px-3 py-1 rounded-full bg-accent text-slate-950 text-[10px] font-black uppercase tracking-widest">
              {property.propertyType}
            </span>
            <p className="text-2xl font-black mt-2 drop-shadow-md">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`relative aspect-[16/10] w-24 sm:w-28 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-slate-950 ring-2 ring-accent'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
