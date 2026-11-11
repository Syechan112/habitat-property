import { localAuthService } from '@/services/auth-local'
import { deviceStorage } from '@/services/device-storage'

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

export interface AdminUser {
  id: number
  email: string
  role: string
  phone: string | null
  created_at: string
}

export interface AdminProperty {
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
  status: string
  images: Array<{ url: string; publicId: string }>
  created_at: string
  updated_at: string
}

export interface AdminInquiry {
  id: number
  property_id: number
  buyer_id: number
  message: string
  phone: string
  status: string
  viewing_date: string | null
  viewing_time: string | null
  title: string
  seller_email: string
  buyer_email: string
  created_at: string
  updated_at: string
}

export const adminApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    try {
      return await request<AdminUser[]>('/users')
    } catch {
      return deviceStorage.getUsers().map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        phone: u.phone ?? null,
        created_at: u.created_at,
      }))
    }
  },

  getAllProperties: async (query?: Record<string, string>): Promise<AdminProperty[]> => {
    try {
      const qs = Object.entries(query ?? {})
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
      return await request<Array<AdminProperty>>(`/properties${qs ? '?' + qs : ''}`)
    } catch {
      let list = deviceStorage.getProperties('admin')
      if (query?.city) list = list.filter((p) => p.city.toLowerCase() === query.city.toLowerCase())
      if (query?.type) list = list.filter((p) => p.propertyType.toLowerCase() === query.type.toLowerCase())
      if (query?.status) list = list.filter((p) => p.status.toLowerCase() === query.status.toLowerCase())
      return list as any as AdminProperty[]
    }
  },

  getInquiries: async (): Promise<AdminInquiry[]> => {
    try {
      return await request<AdminInquiry[]>('/inquiries')
    } catch {
      return deviceStorage.getInquiries()
    }
  },

  updatePropertyStatus: async (id: number, status: string): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/properties/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    } catch {
      const ok = deviceStorage.updatePropertyStatus(id, status)
      return { ok }
    }
  },

  updateInquiryStatus: async (id: number, status: string): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    } catch {
      const ok = deviceStorage.updateInquiryStatus(id, status)
      return { ok }
    }
  },

  deleteProperty: async (id: number): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/properties/${id}`, { method: 'DELETE' })
    } catch {
      const ok = deviceStorage.deleteProperty(id)
      return { ok }
    }
  },

  deleteUser: async (id: number): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/users/${id}`, { method: 'DELETE' })
    } catch {
      const ok = deviceStorage.deleteUser(id)
      return { ok }
    }
  },
}
