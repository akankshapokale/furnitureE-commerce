import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { googleLogout } from '@react-oauth/google'
import {
  API_URL,
  AuthContext,
  type AuthUser,
  type ProfileInput,
} from './authContext'

const TOKEN_KEY = 'auth_token'

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)
  const [user, setUser] = useState<AuthUser | null>(null)
  // A saved token with no user yet means /me is still in flight.
  const loading = token !== null && user === null

  const logout = useCallback(() => {
    googleLogout()
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* storage unavailable */
    }
    setToken(null)
    setUser(null)
  }, [])

  // Restore the session from a saved token on page load.
  useEffect(() => {
    if (!token || user) return

    let cancelled = false

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('session expired')
        const body = await res.json()
        if (!cancelled) setUser(body.data)
      })
      .catch(() => {
        if (!cancelled) logout()
      })

    return () => {
      cancelled = true
    }
  }, [token, user, logout])

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })
    const body = await res.json()

    if (!res.ok) throw new Error(body.message || 'Google sign-in failed')

    try {
      localStorage.setItem(TOKEN_KEY, body.token)
    } catch {
      /* storage unavailable: session lasts until reload */
    }
    setUser(body.data)
    setToken(body.token)

    return body.data as AuthUser
  }, [])

  // Saves the profile and swaps the fresh user into state, so the navbar
  // menu shows the new name straight away.
  const updateProfile = useCallback(
    async (input: ProfileInput) => {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      })
      const body = await res.json()

      if (!res.ok) throw new Error(body.message || 'Failed to update profile')

      setUser(body.data)
      return body.data as AuthUser
    },
    [token],
  )

  const value = useMemo(
    () => ({ user, token, loading, loginWithGoogle, updateProfile, logout }),
    [user, token, loading, loginWithGoogle, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
