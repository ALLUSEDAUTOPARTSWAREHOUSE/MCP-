'use client'

import React, { createContext, useContext } from 'react'

// This is a minimal pass-through provider for Better Auth compatibility
// The actual auth is handled by Better Auth via @/lib/auth and @/lib/auth-client
// This provider exists to prevent runtime errors from old auth context usage

export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Pass-through provider that doesn't interfere with Next.js router initialization
  return (
    <AuthContext.Provider value={{ user: null, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
