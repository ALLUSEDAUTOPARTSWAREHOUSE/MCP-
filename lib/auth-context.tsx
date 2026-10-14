'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('auth-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock auth - in real app would call API
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          createdAt: Date.now(),
        }
        setUser(mockUser)
        localStorage.setItem('auth-user', JSON.stringify(mockUser))
      } else {
        throw new Error('Invalid credentials')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Mock auth - in real app would call API
      if (email && password.length >= 6 && name) {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          createdAt: Date.now(),
        }
        setUser(mockUser)
        localStorage.setItem('auth-user', JSON.stringify(mockUser))
      } else {
        throw new Error('Invalid credentials')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth-user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
