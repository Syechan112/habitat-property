import { useState, useRef, type ChangeEvent } from 'react'
import { UploadCloud, X, CheckCircle2, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react'
import { sellerApi, type UploadedImageResult } from '@/services/seller-api'
import { Button } from '@/components/ui/button'

interface PropertyImageUploaderProps {
  images: UploadedImageResult[]
  onChange: (images: UploadedImageResult[]) => void
}

export default function PropertyImageUploader({
  images,
  onChange,
}: PropertyImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadError(null)
    setSuccessInfo(null)
    setIsUploading(true)

    const newlyUploaded: UploadedImageResult[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const result = await sellerApi.uploadImage(file)
        newlyUploaded.push(result)
      }

      const updated = [...images, ...newlyUploaded]
      onChange(updated)
      setSuccessInfo(
        `${newlyUploaded.length} foto berhasil diunggah & di-resize otomatis ke format WebP!`
      )
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Gagal mengunggah foto.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async (index: number) => {
    const target = images[index]
    if (target?.publicId) {
      try {
        await sellerApi.deleteImage(target.publicId)
      } catch {
        // continue even if delete api fails
      }
    }
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    return bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`
  }

  return (
    <div className="space-y-4 sm:col-span-2 pt-2 border-t border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-emerald-600" />
            <span>Foto & Galeri Properti (Sistem Resize Otomatis)</span>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Foto akan otomatis di-resize (maks. 1600px), dikompres ke WebP, dan disimpan ke folder <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">public/uploads</code> & database SQLite.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="property-image-input"
        />

        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full text-xs font-bold gap-2 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-700" />
              <span>Memproses & Me-resize...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-3.5 w-3.5 text-slate-700" />
              <span>Unggah Foto Properti</span>
            </>
          )}
        </Button>
      </div>

      {uploadError && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {uploadError}
        </div>
      )}

      {successInfo && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {/* Uploaded Thumbnails Preview Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => {
            const displayUrl = img.url.startsWith('http') ? img.url : `http://localhost:3001${img.url}`
            return (
              <div
                key={img.publicId || idx}
                className="group relative rounded-2xl border border-slate-200/90 bg-slate-50 overflow-hidden shadow-tactile-xs"
              >
                <div className="aspect-4/3 w-full bg-slate-200 overflow-hidden">
                  <img
                    src={displayUrl}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-tactile-xs cursor-pointer"
                  title="Hapus foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Resizing & Compression Stats Pill */}
                <div className="p-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                    <span>{img.width ? `${img.width}×${img.height}` : 'WebP'}</span>
                    <span className="text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      {img.savedPercent ? `-${img.savedPercent}%` : 'Opt'}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 truncate">
                    {formatSize(img.sizeBytes)} • WebP
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-slate-400 hover:bg-slate-50/50 transition-all cursor-pointer space-y-2"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              Belum ada foto yang dipilih
            </p>
            <p className="text-[11px] text-slate-400">
              Klik di sini atau tombol di atas untuk mengunggah satu atau beberapa foto hunian.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
