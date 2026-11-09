import { localAuthService } from '@/services/auth-local'

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
  getUsers: () => request<AdminUser[]>('/users'),
  getAllProperties: (query?: Record<string, string>) => {
    const qs = Object.entries(query ?? {})
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')
    return request<Array<AdminProperty>>(`/properties${qs ? '?' + qs : ''}`)
  },
  getInquiries: () => request<AdminInquiry[]>('/inquiries'),
  updatePropertyStatus: (id: number, status: string) =>
    request<{ ok: boolean }>(`/properties/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateInquiryStatus: (id: number, status: string) =>
    request<{ ok: boolean }>(`/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteProperty: (id: number) =>
    request<{ ok: boolean }>(`/properties/${id}`, { method: 'DELETE' }),
  deleteUser: (id: number) =>
    request<{ ok: boolean }>(`/users/${id}`, { method: 'DELETE' }),
}
