'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ThemeMode = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeContextValue {
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  resolvedTheme: ResolvedTheme
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'dark',
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')

  // Detect system preference
  function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }

  // Resolve the final theme to apply
  function resolveTheme(themeMode: ThemeMode): ResolvedTheme {
    if (themeMode === 'system') return getSystemTheme()
    return themeMode
  }

  // Apply theme classes to DOM
  function applyTheme(resolved: ResolvedTheme) {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.classList.toggle('light', resolved === 'light')
    setResolvedTheme(resolved)
  }

  // Set theme preference and save to localStorage
  function setTheme(t: ThemeMode) {
    setThemeState(t)
    const resolved = resolveTheme(t)
    applyTheme(resolved)
    try { localStorage.setItem('auapw-theme', t) } catch { /* noop */ }
  }

  // Initialize theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('auapw-theme') as ThemeMode | null
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeState(saved)
        const resolved = resolveTheme(saved)
        applyTheme(resolved)
      } else {
        // Default to system
        const resolved = getSystemTheme()
        applyTheme(resolved)
      }
    } catch {
      const resolved = getSystemTheme()
      applyTheme(resolved)
    }
  }, [])

  // Listen to system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = () => {
      const resolved = getSystemTheme()
      applyTheme(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
