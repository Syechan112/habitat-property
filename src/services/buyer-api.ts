import { localAuthService } from '@/services/auth-local'
import { deviceStorage } from '@/services/device-storage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
const FAVORITES_KEY = 'habitat_device_favorites_v1'

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

function getLocalFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalFavorites(ids: number[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}

export const buyerApi = {
  getFavorites: async (): Promise<number[]> => {
    try {
      return await request<number[]>('/favorites')
    } catch {
      return getLocalFavorites()
    }
  },

  addFavorite: async (propertyId: number): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>('/favorites', {
        method: 'POST',
        body: JSON.stringify({ propertyId }),
      })
    } catch {
      const favs = getLocalFavorites()
      if (!favs.includes(propertyId)) {
        favs.push(propertyId)
        setLocalFavorites(favs)
      }
      return { ok: true }
    }
  },

  removeFavorite: async (propertyId: number): Promise<{ ok: boolean }> => {
    try {
      return await request<{ ok: boolean }>(`/favorites/${propertyId}`, { method: 'DELETE' })
    } catch {
      const favs = getLocalFavorites().filter((id) => id !== propertyId)
      setLocalFavorites(favs)
      return { ok: true }
    }
  },

  createInquiry: async (payload: {
    propertyId: number
    message: string
    phone: string
    viewingDate: string
    viewingTime: string
  }): Promise<{ id: number; ok: boolean }> => {
    const user = localAuthService.getSession()?.user
    try {
      return await request<{ id: number; ok: boolean }>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    } catch {
      const created = deviceStorage.createInquiry(
        payload,
        user ?? { id: 1, email: 'buyer@habitat.test' }
      )
      return { id: created.id, ok: true }
    }
  },
}
