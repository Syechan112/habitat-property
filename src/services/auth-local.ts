import { deviceStorage } from '@/services/device-storage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  role: 'buyer' | 'seller' | 'admin'
}

export interface UserRecord {
  id: number
  email: string
  role: string
}

async function fetchJson<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.error ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

export const localAuthService = {
  signUp: async (payload: RegisterPayload) => {
    try {
      return await fetchJson<{ token: string; user: UserRecord }>(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // Fallback ke penyimpanan perangkat lokal jika backend offline
      const created = deviceStorage.registerUser(payload.email, payload.role)
      return {
        token: `dev_token_${created.role}_${created.id}`,
        user: { id: created.id, email: created.email, role: created.role },
      }
    }
  },

  signIn: async (payload: LoginPayload) => {
    try {
      return await fetchJson<{ token: string; user: UserRecord }>(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // Fallback ke akun di perangkat lokal
      const users = deviceStorage.getUsers()
      const found = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase())
      if (found) {
        return {
          token: `dev_token_${found.role}_${found.id}`,
          user: { id: found.id, email: found.email, role: found.role },
        }
      }
      throw new Error('Email atau password tidak cocok. Silakan coba lagi.')
    }
  },

  signOut: () => {
    localStorage.removeItem('habitat_token')
    localStorage.removeItem('habitat_user')
  },

  getSession: (): { token: string; user: UserRecord } | null => {
    const token = localStorage.getItem('habitat_token')
    const raw = localStorage.getItem('habitat_user')
    try {
      const user = raw ? JSON.parse(raw) : null
      return token ? { token, user } : null
    } catch {
      return null
    }
  },

  persistSession: (token: string, user: UserRecord) => {
    localStorage.setItem('habitat_token', token)
    localStorage.setItem('habitat_user', JSON.stringify(user))
  },
}