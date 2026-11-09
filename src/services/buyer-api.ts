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

export const buyerApi = {
  getFavorites: () => request<number[]>('/favorites'),
  addFavorite: (propertyId: number) => request<{ ok: boolean }>('/favorites', { method: 'POST', body: JSON.stringify({ propertyId }) }),
  removeFavorite: (propertyId: number) => request<{ ok: boolean }>(`/favorites/${propertyId}`, { method: 'DELETE' }),
  createInquiry: (payload: { propertyId: number; message: string; phone: string; viewingDate: string; viewingTime: string }) => request<{ id: number; ok: boolean }>('/inquiries', { method: 'POST', body: JSON.stringify(payload) }),
}
