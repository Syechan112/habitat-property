import { INITIAL_PROPERTIES, type StoredProperty } from '@/constants/initial-properties'

const STORAGE_KEYS = {
  PROPERTIES: 'habitat_device_properties_v1',
  INQUIRIES: 'habitat_device_inquiries_v1',
  USERS: 'habitat_device_users_v1',
}

export interface StoredUser {
  id: number
  email: string
  role: 'buyer' | 'seller' | 'admin'
  phone?: string | null
  created_at: string
}

export interface StoredInquiry {
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

const DEFAULT_USERS: StoredUser[] = [
  { id: 1, email: 'buyer@habitat.test', role: 'buyer', phone: '+628123456789', created_at: '2026-11-10T00:00:00Z' },
  { id: 2, email: 'seller@habitat.test', role: 'seller', phone: '+628987654321', created_at: '2026-11-10T00:00:00Z' },
  { id: 3, email: 'admin@habitat.test', role: 'admin', phone: '+628000000000', created_at: '2026-11-10T00:00:00Z' },
]

class DeviceStorageManager {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key)
      if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback))
        return fallback
      }
      return JSON.parse(data)
    } catch {
      return fallback
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch (err) {
      console.warn('Gagal menyimpan ke storage perangkat lokal:', err)
    }
  }

  // --- PROPERTIES ---
  getProperties(role?: string, userId?: number): StoredProperty[] {
    const all = this.getStorage<StoredProperty[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES)
    if (role === 'admin') return all
    if (role === 'seller' && userId) {
      return all.filter((p) => p.status === 'available' || p.sellerId === userId)
    }
    return all.filter((p) => p.status === 'available')
  }

  getPropertyById(id: number): StoredProperty | null {
    const all = this.getProperties('admin')
    return all.find((p) => p.id === Number(id)) ?? null
  }

  createProperty(data: any, user: { id: number; email: string }): StoredProperty {
    const all = this.getProperties('admin')
    const maxId = all.reduce((max, p) => Math.max(max, p.id), 0)
    const newProperty: StoredProperty = {
      id: maxId + 1,
      title: data.title,
      description: data.description,
      price: Number(data.price),
      location: data.location,
      city: data.city,
      propertyType: data.propertyType,
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      areaSqft: Number(data.areaSqft),
      sellerId: user.id,
      sellerEmail: user.email,
      status: 'pending', // Wajib pending menunggu review admin
      images: Array.isArray(data.images)
        ? data.images.map((img: any) => ({
            url: typeof img === 'string' ? img : img.url,
            thumbnailUrl: typeof img === 'object' ? img.thumbnailUrl : undefined,
            publicId: typeof img === 'object' ? (img.publicId ?? `img_${Date.now()}`) : `img_${Date.now()}`,
            width: typeof img === 'object' ? img.width : undefined,
            height: typeof img === 'object' ? img.height : undefined,
            sizeBytes: typeof img === 'object' ? img.sizeBytes : undefined,
          }))
        : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    all.unshift(newProperty)
    this.setStorage(STORAGE_KEYS.PROPERTIES, all)
    return newProperty
  }

  updatePropertyStatus(id: number, status: string): boolean {
    const all = this.getProperties('admin')
    const idx = all.findIndex((p) => p.id === Number(id))
    if (idx === -1) return false
    all[idx].status = status as StoredProperty['status']
    all[idx].updated_at = new Date().toISOString()
    this.setStorage(STORAGE_KEYS.PROPERTIES, all)
    return true
  }

  deleteProperty(id: number): boolean {
    const all = this.getProperties('admin')
    const filtered = all.filter((p) => p.id !== Number(id))
    this.setStorage(STORAGE_KEYS.PROPERTIES, filtered)
    return true
  }

  // --- SELLER LISTINGS ---
  getSellerProperties(sellerId: number): StoredProperty[] {
    const all = this.getProperties('admin')
    return all.filter((p) => p.sellerId === Number(sellerId))
  }

  // --- USERS ---
  getUsers(): StoredUser[] {
    return this.getStorage<StoredUser[]>(STORAGE_KEYS.USERS, DEFAULT_USERS)
  }

  registerUser(email: string, role: StoredUser['role']): StoredUser {
    const users = this.getUsers()
    const maxId = users.reduce((max, u) => Math.max(max, u.id), 0)
    const newUser: StoredUser = { id: maxId + 1, email, role, phone: null, created_at: new Date().toISOString() }
    users.unshift(newUser)
    this.setStorage(STORAGE_KEYS.USERS, users)
    return newUser
  }

  deleteUser(id: number): boolean {
    const users = this.getUsers().filter((u) => u.id !== Number(id))
    this.setStorage(STORAGE_KEYS.USERS, users)
    return true
  }

  // --- INQUIRIES ---
  getInquiries(): StoredInquiry[] {
    return this.getStorage<StoredInquiry[]>(STORAGE_KEYS.INQUIRIES, [])
  }

  createInquiry(data: any, buyer: { id: number; email: string }): StoredInquiry {
    const inquiries = this.getInquiries()
    const prop = this.getPropertyById(data.propertyId)
    const maxId = inquiries.reduce((max, i) => Math.max(max, i.id), 0)
    const newInquiry: StoredInquiry = {
      id: maxId + 1,
      property_id: Number(data.propertyId),
      buyer_id: buyer.id,
      message: data.message,
      phone: data.phone,
      status: 'pending',
      viewing_date: data.viewingDate ?? null,
      viewing_time: data.viewingTime ?? null,
      title: prop?.title ?? 'Listing Properti',
      seller_email: prop?.sellerEmail ?? 'seller@habitat.test',
      buyer_email: buyer.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    inquiries.unshift(newInquiry)
    this.setStorage(STORAGE_KEYS.INQUIRIES, inquiries)
    return newInquiry
  }

  updateInquiryStatus(id: number, status: string): boolean {
    const inquiries = this.getInquiries()
    const idx = inquiries.findIndex((i) => i.id === Number(id))
    if (idx === -1) return false
    inquiries[idx].status = status
    inquiries[idx].updated_at = new Date().toISOString()
    this.setStorage(STORAGE_KEYS.INQUIRIES, inquiries)
    return true
  }
}

export const deviceStorage = new DeviceStorageManager()
