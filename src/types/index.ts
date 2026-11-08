export type UserRole = 'buyer' | 'seller' | 'admin'

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  role: UserRole
  phone?: string
  avatarUrl?: string
  createdAt?: string
}

export type PropertyStatus =
  | 'draft'
  | 'pending'
  | 'available'
  | 'reserved'
  | 'sold'
  | 'rejected'
  | 'archived'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'viewing'
  | 'negotiation'
  | 'won'
  | 'lost'

export interface Property {
  id: string
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
  status: PropertyStatus
  sellerId: string
  createdAt: string
  updatedAt: string
}

export interface Inquiry {
  id: string
  propertyId: string
  buyerId: string
  sellerId: string
  message: string
  phone?: string
  status: LeadStatus
  createdAt: string
}
