import { localAuthService } from '@/services/auth-local'
import { deviceStorage } from '@/services/device-storage'
import { resizeImageOnDevice } from '@/utils/image-resizer'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localAuthService.getSession()?.token
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.error ?? `Request failed (${response.status})`)
  }
  return response.json()
}

export interface UploadedImageResult {
  id?: number
  url: string
  thumbnailUrl?: string
  publicId: string
  width?: number
  height?: number
  sizeBytes?: number
  originalSize?: number
  savedPercent?: number
  format?: string
}

export interface SellerProperty {
  id: number
  title: string
  description: string
  price: number
  location: string
  city: string
  propertyType: 'house' | 'apartment' | 'villa' | 'land' | 'commercial'
  bedrooms: number
  bathrooms: number
  areaSqft: number
  status: 'draft' | 'pending' | 'available' | 'reserved' | 'sold' | 'rejected' | 'archived'
  images: Array<{ url: string; thumbnailUrl?: string; publicId: string; width?: number; height?: number; sizeBytes?: number }>
  created_at: string
  updated_at: string
}

export interface SellerInquiry {
  id: number
  propertyId: number
  buyerId: number
  message: string
  phone: string
  viewingDate: string
  viewingTime: string
  status: string
  title: string
  sellerEmail: string
  buyerEmail: string
  created_at: string
  updated_at: string
}

function mapInquiry(row: any): SellerInquiry {
  return {
    id: row.id,
    propertyId: row.property_id ?? row.propertyId,
    buyerId: row.buyer_id ?? row.buyerId,
    message: row.message,
    phone: row.phone,
    viewingDate: row.viewing_date ?? row.viewingDate ?? '',
    viewingTime: row.viewing_time ?? row.viewingTime ?? '',
    status: row.status,
    title: row.title,
    sellerEmail: row.seller_email ?? row.sellerEmail,
    buyerEmail: row.buyer_email ?? row.buyerEmail,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const sellerApi = {
  getMyProperties: async (): Promise<SellerProperty[]> => {
    const user = localAuthService.getSession()?.user
    try {
      return await request<SellerProperty[]>('/properties/my')
    } catch {
      if (!user) return []
      return deviceStorage.getSellerProperties(user.id) as any as SellerProperty[]
    }
  },

  createProperty: async (payload: {
    title: string; description: string; price: number; location: string; city: string;
    propertyType: string; bedrooms: number; bathrooms: number; areaSqft: number;
    images?: Array<UploadedImageResult | string>
  }): Promise<{ id: number; success: boolean }> => {
    const user = localAuthService.getSession()?.user
    try {
      return await request<{ id: number; success: boolean }>('/properties', {
        method: 'POST', body: JSON.stringify(payload),
      })
    } catch {
      const created = deviceStorage.createProperty(payload, user ?? { id: 2, email: 'seller@habitat.test' })
      return { id: created.id, success: true }
    }
  },

  getInquiries: async (): Promise<SellerInquiry[]> => {
    const user = localAuthService.getSession()?.user
    try {
      const rows = await request<any[]>('/inquiries')
      return rows.map(mapInquiry)
    } catch {
      const stored = deviceStorage.getInquiries()
      return (user ? stored.filter((i) => i.seller_email === user.email) : stored).map(mapInquiry)
    }
  },

  updateInquiryStatus: async (id: number, status: string): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/inquiries/${id}/status`, {
        method: 'PATCH', body: JSON.stringify({ status }),
      })
    } catch {
      return { ok: deviceStorage.updateInquiryStatus(id, status) }
    }
  },

  deleteProperty: async (id: number): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/properties/${id}`, { method: 'DELETE' })
    } catch {
      return { ok: deviceStorage.deleteProperty(id) }
    }
  },

  uploadImage: async (file: File, options?: { maxWidth?: number; quality?: number }): Promise<UploadedImageResult> => {
    const resized = await resizeImageOnDevice(file, {
      maxWidth: options?.maxWidth ?? 1600, quality: options?.quality ?? 0.85,
    })

    try {
      const form = new FormData()
      form.append('image', file)
      const token = localAuthService.getSession()?.token
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form,
      })
      if (res.ok) {
        const data = await res.json()
        return { ...data, savedPercent: resized.savedPercent, originalSize: resized.originalSize, sizeBytes: resized.sizeBytes }
      }
    } catch {
      // offline / static hosting mode
    }

    return {
      url: resized.url, thumbnailUrl: resized.thumbnailUrl, publicId: resized.publicId,
      width: resized.width, height: resized.height, sizeBytes: resized.sizeBytes,
      originalSize: resized.originalSize, savedPercent: resized.savedPercent, format: 'webp',
    }
  },

  deleteImage: async (filename: string): Promise<{ ok: boolean; deleted: string }> => {
    try {
      return await request<{ ok: boolean; deleted: string }>(`/upload/${filename}`, { method: 'DELETE' })
    } catch {
      return { ok: true, deleted: filename }
    }
  },

  getUploadedImages: async (): Promise<any[]> => {
    try {
      return await request<any[]>('/images')
    } catch {
      return []
    }
  },
}
