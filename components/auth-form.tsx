'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const isSignUp = mode === 'sign-up'

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setError(null)
    setLoading(true)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: redirectTo,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} sign-in failed`)
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({ email, password, name })
        if (result.error) {
          setError(result.error.message ?? 'Sign-up failed')
          setLoading(false)
          return
        }
        // After sign-up, show OTP verification step
        setPendingEmail(email)
        setStep('verify')
        setLoading(false)
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) {
          setError(result.error.message ?? 'Sign-in failed')
          setLoading(false)
          return
        }
        // Redirect on successful sign-in
        router.push(redirectTo)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code: otp }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      // Verification successful, redirect
      router.push(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm p-6 border border-white/10 bg-white/5">
      {step === 'form' ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isSignUp ? 'Create an account' : 'Sign in'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? 'Join AUAPW today' : 'Access your account'}
            </p>
          </div>

          {/* OAuth Buttons */}
          {isSignUp && (
            <div className="space-y-2 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/20 border-white/20"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/20 border-white/20"
                onClick={() => handleOAuthSignIn('apple')}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 13.5c-.12-1.82.74-3.47 2.54-4.37-1.14-1.67-2.87-2.63-4.81-2.63-1.98 0-3.72.91-4.88 2.4-1.16-1.49-2.9-2.4-4.88-2.4-1.94 0-3.67.96-4.81 2.63 1.8.9 2.66 2.55 2.54 4.37C2.84 15.23 1.5 17.2 1.5 19.5 1.5 21.43 2.87 23 4.5 23c1.26 0 2.35-.7 2.9-1.75h7.2c.55 1.05 1.64 1.75 2.9 1.75 1.63 0 3-1.57 3-3.5 0-2.3-1.34-4.27-3.45-5m-1.45-1.35c0 1.48-1.2 2.68-2.68 2.68s-2.68-1.2-2.68-2.68 1.2-2.68 2.68-2.68 2.68 1.2 2.68 2.68m-9.3 0c0 1.48-1.2 2.68-2.68 2.68S1.9 13.63 1.9 12.15s1.2-2.68 2.68-2.68 2.68 1.2 2.68 2.68" />
                </svg>
                Sign up with Apple
              </Button>
            </div>
          )}

          {/* Divider */}
          {isSignUp && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/5 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              {isSignUp && <p className="text-xs text-muted-foreground">Minimum 8 characters</p>}
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="text-blue-400 font-medium hover:text-blue-300"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Verify your email</h1>
            <p className="text-sm text-muted-foreground mt-1">
              We&apos;ve sent a verification code to {pendingEmail}
            </p>
          </div>

          <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                autoComplete="one-time-code"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading || otp.length !== 6} className="w-full">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setStep('form')
              setError(null)
            }}
            className="text-sm text-blue-400 hover:text-blue-300 mt-4"
          >
            Change email
          </button>
        </>
      )}
    </Card>
  )
}
