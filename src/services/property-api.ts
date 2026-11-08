import { localAuthService } from '@/services/auth-local'

export interface Property {
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
  images: Array<{ url: string; publicId: string }>
  status: 'draft' | 'pending' | 'available' | 'reserved' | 'sold' | 'rejected' | 'archived'
}

export interface PropertyResponse {
  properties: Property[]
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.error ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

class PropertyApi {
  private baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

  async getProperties(): Promise<PropertyResponse> {
    const res = await fetch(`${this.baseUrl}/properties`)
    if (!res.ok) throw new Error('Failed to load properties')
    const data: PropertyResponse = await res.json()
    return { properties: Array.isArray(data) ? data : data.properties ?? [] }
  }

  async createProperty(data: any): Promise<any> {
    const { token } = localAuthService.getSession() ?? {}
    if (!token) throw new Error('Not authenticated')
    return fetchJson<any>(`${this.baseUrl}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
  }
}

export const propertyApi = new PropertyApi()
