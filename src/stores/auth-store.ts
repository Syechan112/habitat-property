import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

interface AuthState {
  session: Session | null
  role: UserRole | null
  isLoading: boolean
  setSession: (session: Session | null) => void
  setRole: (role: UserRole | null) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  role: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ session: null, role: null, isLoading: false }),
}))
