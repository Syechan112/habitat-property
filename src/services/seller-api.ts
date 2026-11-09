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
  images: Array<{ url: string; publicId: string }>
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
    propertyId: row.property_id,
    buyerId: row.buyer_id,
    message: row.message,
    phone: row.phone,
    viewingDate: row.viewing_date ?? '',
    viewingTime: row.viewing_time ?? '',
    status: row.status,
    title: row.title,
    sellerEmail: row.seller_email,
    buyerEmail: row.buyer_email,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export const sellerApi = {
  getMyProperties: () => request<SellerProperty[]>('/properties/my'),
  createProperty: (payload: { title: string; description: string; price: number; location: string; city: string; propertyType: string; bedrooms: number; bathrooms: number; areaSqft: number }) =>
    request<{ id: number; success: boolean }>('/properties', { method: 'POST', body: JSON.stringify(payload) }),
  getInquiries: () => request<any[]>('/inquiries').then((rows) => rows.map(mapInquiry)),
  updatePropertyStatus: (id: number, status: string) =>
    request<{ ok: boolean }>(`/properties/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateInquiryStatus: (id: number, status: string) =>
    request<{ ok: boolean }>(`/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteProperty: (id: number) =>
    request<{ ok: boolean }>(`/properties/${id}`, { method: 'DELETE' }),
  uploadImage: (file: File): Promise<{ url: string; publicId: string }> => {
    const form = new FormData()
    form.append('image', file)
    const token = localAuthService.getSession()?.token
    return fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then((res) => {
      if (!res.ok) return res.json().then((body: any) => { throw new Error(body?.error ?? 'Upload failed') })
      return res.json()
    })
  },
}