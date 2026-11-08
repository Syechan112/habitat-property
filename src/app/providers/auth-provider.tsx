import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { UserRole } from '@/types'
import { localAuthService, type UserRecord } from '@/services/auth-local'

interface AuthSession {
  token: string
  user: UserRecord
}

interface AuthContextValue {
  session: AuthSession | null
  role: UserRole | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: UserRole) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const active = localAuthService.getSession()
    setSession(active)
    setIsLoading(false)
  }, [])

  const role = (session?.user.role as UserRole) ?? null

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await localAuthService.signIn({ email, password })
      localAuthService.persistSession(res.token, res.user)
      setSession(res)
      setIsLoading(false)
      return { error: null }
    } catch (err: any) {
      setIsLoading(false)
      return { error: err.message || 'Login failed' }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, selectedRole: UserRole) => {
    setIsLoading(true)
    try {
      await localAuthService.signUp({ email, password, role: selectedRole })
      setIsLoading(false)
      return { error: null }
    } catch (err: any) {
      setIsLoading(false)
      return { error: err.message || 'Registration failed' }
    }
  }, [])

  const signOut = useCallback(async () => {
    localAuthService.signOut()
    setSession(null)
  }, [])

  const value = useMemo(() => ({
    session,
    role,
    isLoading,
    signIn,
    signUp,
    signOut,
  }), [session, role, isLoading, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
