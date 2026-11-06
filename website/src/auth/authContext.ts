import { createContext, useContext } from 'react'

export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  avatar_url: string | null
  pincode?: string | null
  flat?: string | null
  area?: string | null
  landmark?: string | null
  city?: string | null
  state?: string | null
}

export interface ProfileInput {
  name: string
  phone?: string
  pincode?: string
  flat?: string
  area?: string
  landmark?: string
  city?: string
  state?: string
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  loginWithGoogle: (credential: string) => Promise<AuthUser>
  updateProfile: (input: ProfileInput) => Promise<AuthUser>
  logout: () => void
}

// Strip trailing slashes so a VITE_API_URL like "https://api.example.com/" can't produce "//api/..." URLs.
export const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
).replace(/\/+$/, '')

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
