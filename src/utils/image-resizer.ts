export interface ResizedImageResult {
  url: string
  thumbnailUrl: string
  publicId: string
  filename: string
  width: number
  height: number
  sizeBytes: number
  originalSize: number
  originalName: string
  mimeType: string
  savedPercent: number
  format: string
}

export interface ResizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

/**
 * Resizes an image file directly on the user's device browser using HTML5 Canvas.
 * Converts to high-efficiency WebP with zero external cloud dependencies or token usage.
 */
export async function resizeImageOnDevice(
  file: File,
  options?: ResizeOptions
): Promise<ResizedImageResult> {
  const maxWidth = options?.maxWidth ?? 1600
  const maxHeight = options?.maxHeight ?? 1600
  const quality = options?.quality ?? 0.82

  const originalSize = file.size
  const originalName = file.name
  const uniqueId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar dari perangkat.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Format gambar tidak didukung atau file korup.'))
      img.onload = () => {
        try {
          // 1. Calculate aspect ratio for Main Display Image (max 1600px inside)
          let targetWidth = img.width
          let targetHeight = img.height

          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight)
            targetWidth = Math.round(targetWidth * ratio)
            targetHeight = Math.round(targetHeight * ratio)
          }

          const mainCanvas = document.createElement('canvas')
          mainCanvas.width = targetWidth
          mainCanvas.height = targetHeight
          const mainCtx = mainCanvas.getContext('2d', { alpha: false })
          if (!mainCtx) throw new Error('Canvas 2D context tidak tersedia.')

          mainCtx.imageSmoothingEnabled = true
          mainCtx.imageSmoothingQuality = 'high'
          mainCtx.drawImage(img, 0, 0, targetWidth, targetHeight)

          // 2. Generate Bento / Card Thumbnail (600x400 cover cropped to center)
          const thumbWidth = 600
          const thumbHeight = 400
          const thumbCanvas = document.createElement('canvas')
          thumbCanvas.width = thumbWidth
          thumbCanvas.height = thumbHeight
          const thumbCtx = thumbCanvas.getContext('2d', { alpha: false })
          if (!thumbCtx) throw new Error('Thumbnail canvas context tidak tersedia.')

          thumbCtx.imageSmoothingEnabled = true
          thumbCtx.imageSmoothingQuality = 'high'

          // Compute crop to fill 600x400 centered
          const imgAspect = img.width / img.height
          const thumbAspect = thumbWidth / thumbHeight
          let sWidth = img.width
          let sHeight = img.height
          let sx = 0
          let sy = 0

          if (imgAspect > thumbAspect) {
            sWidth = Math.round(img.height * thumbAspect)
            sx = Math.round((img.width - sWidth) / 2)
          } else {
            sHeight = Math.round(img.width / thumbAspect)
            sy = Math.round((img.height - sHeight) / 2)
          }

          thumbCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, thumbWidth, thumbHeight)

          // Export both to WebP data URLs
          const mainDataUrl = mainCanvas.toDataURL('image/webp', quality)
          const thumbDataUrl = thumbCanvas.toDataURL('image/webp', 0.78)

          // Approximate size from data URL length
          const base64Length = mainDataUrl.length - (mainDataUrl.indexOf(',') + 1)
          const sizeBytes = Math.round((base64Length * 3) / 4)
          const savedPercent = Math.max(0, Math.round((1 - sizeBytes / originalSize) * 100))

          resolve({
            url: mainDataUrl,
            thumbnailUrl: thumbDataUrl,
            publicId: uniqueId,
            filename: `${uniqueId}.webp`,
            width: targetWidth,
            height: targetHeight,
            sizeBytes,
            originalSize,
            originalName,
            mimeType: 'image/webp',
            savedPercent,
            format: 'webp',
          })
        } catch (err) {
          reject(err)
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
