'use client'

import { useEffect } from 'react'

const INTERCOM_APP_ID = 'pldz9zi1'

interface IntercomUser {
  id?: string
  name?: string
  email?: string
  createdAt?: number
}

interface IntercomProviderProps {
  user?: IntercomUser
}

declare global {
  interface Window {
    Intercom: any
  }
}

export function IntercomProvider({ user }: IntercomProviderProps) {
  useEffect(() => {
    let cancelled = false

    const bootIntercom = async () => {
      // Script is loaded via next/script in layout, check if window.Intercom is available
      if (typeof window.Intercom !== 'function') {
        console.warn('[v0] Intercom: window.Intercom not available yet')
        return
      }

      // Anonymous visitors: boot the messenger immediately
      if (!user?.id) {
        window.Intercom('boot', {
          app_id: INTERCOM_APP_ID,
        })
        return
      }

      // Authenticated users: fetch JWT token and boot with it
      try {
        const res = await fetch('/api/intercom-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            email: user?.email,
            name: user?.name,
          }),
        })

        if (cancelled) return

        if (res.ok) {
          const { token } = await res.json()
          window.Intercom('boot', {
            api_base: 'https://api-iam.intercom.io',
            app_id: INTERCOM_APP_ID,
            intercom_user_jwt: token,
            session_duration: 86400000, // 1 day
          })
        } else {
          window.Intercom('boot', {
            app_id: INTERCOM_APP_ID,
          })
        }
      } catch {
        if (!cancelled) {
          window.Intercom('boot', {
            app_id: INTERCOM_APP_ID,
          })
        }
      }
    }

    // Check immediately, then retry if Intercom not ready yet
    if (typeof window.Intercom === 'function') {
      bootIntercom()
    } else {
      // Retry after a short delay if Intercom script hasn't loaded yet
      const timer = setTimeout(() => bootIntercom(), 500)
      return () => {
        cancelled = true
        clearTimeout(timer)
      }
    }

    return () => {
      cancelled = true
    }
  }, [user])

  return null
}
