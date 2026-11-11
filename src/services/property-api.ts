import { localAuthService } from '@/services/auth-local'
import { deviceStorage } from '@/services/device-storage'

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
  images: Array<{ url: string; thumbnailUrl?: string; publicId: string }>
  status: 'draft' | 'pending' | 'available' | 'reserved' | 'sold' | 'rejected' | 'archived'
}

interface ApiProperty {
  id: number
  title: string
  description: string
  price: number
  location: string
  city: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  images: Array<{ url: string; thumbnailUrl?: string; publicId: string }>
  status: string
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localAuthService.getSession()?.token
  const headers = new Headers(options.headers)
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.error ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

function mapProperty(property: ApiProperty): Property {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    city: property.city,
    propertyType: property.property_type as Property['propertyType'],
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqft: property.area_sqft,
    images: Array.isArray(property.images) ? property.images : [],
    status: property.status as Property['status'],
  }
}

class PropertyApi {
  private baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

  async getProperties(): Promise<{ properties: Property[] }> {
    try {
      const data = await fetchJson<any>(`${this.baseUrl}/properties`)
      const list = Array.isArray(data) ? data : (Array.isArray(data?.properties) ? data.properties : [])
      return { properties: list.map(mapProperty) }
    } catch {
      // Fallback ke penyimpanan lokal perangkat jika backend offline / saat di-hosting
      const local = deviceStorage.getProperties('buyer')
      return {
        properties: local.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          city: p.city,
          propertyType: p.propertyType,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          areaSqft: p.areaSqft,
          images: p.images || [],
          status: p.status,
        })),
      }
    }
  }

  async getProperty(id: number): Promise<Property> {
    try {
      const data = await fetchJson<any>(`${this.baseUrl}/properties/${id}`)
      const item = data?.property ?? data
      return mapProperty(item)
    } catch {
      const item = deviceStorage.getPropertyById(id)
      if (!item) throw new Error('Properti tidak ditemukan')
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        location: item.location,
        city: item.city,
        propertyType: item.propertyType,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        areaSqft: item.areaSqft,
        images: item.images || [],
        status: item.status,
      }
    }
  }

  async createProperty(data: any): Promise<any> {
    const session = localAuthService.getSession()
    if (!session?.token) throw new Error('Not authenticated')
    try {
      return await fetchJson<any>(`${this.baseUrl}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify(data),
      })
    } catch {
      const created = deviceStorage.createProperty(data, {
        id: session.user.id || 2,
        email: session.user.email || 'seller@habitat.test',
      })
      return { id: created.id, success: true }
    }
  }
}

export const propertyApi = new PropertyApi()