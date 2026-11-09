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
  images: Array<{ url: string; publicId: string }>
  status: string
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options)
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
    const data = await fetchJson<ApiProperty[]>(`${this.baseUrl}/properties`)
    return { properties: data.map(mapProperty) }
  }

  async getProperty(id: number): Promise<Property> {
    const data = await fetchJson<{ property: ApiProperty }>(`${this.baseUrl}/properties/${id}`)
    return mapProperty(data.property)
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