import type { AuthResponse, Session, UserResponse } from '@supabase/supabase-js'
import { supabase } from './client'
import type { UserRole } from '@/types'

export interface AuthCredentials {
  email: string
  password: string
}

export const authService = {
  signIn: (credentials: AuthCredentials): Promise<AuthResponse> =>
    supabase.auth.signInWithPassword(credentials),

  signUp: (credentials: AuthCredentials, role: UserRole): Promise<AuthResponse> =>
    supabase.auth.signUp({
      ...credentials,
      options: { data: { role } },
    }),

  signOut: () => supabase.auth.signOut(),

  getSession: (): Promise<{ data: { session: Session | null }; error: null }> =>
    supabase.auth.getSession().then(({ data }) => ({ data, error: null })),

  onAuthStateChange: (callback: (session: Session | null) => void) =>
    supabase.auth.onAuthStateChange((_event, session) => callback(session)),

  getUser: (): Promise<UserResponse> => supabase.auth.getUser(),
}
