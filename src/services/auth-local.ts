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
  signUp: (payload: RegisterPayload) =>
    fetchJson<{ token: string; user: UserRecord }>(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  signIn: (payload: LoginPayload) =>
    fetchJson<{ token: string; user: UserRecord }>(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

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