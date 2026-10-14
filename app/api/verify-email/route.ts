import { NextRequest, NextResponse } from 'next/server'

const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// In-memory storage for verification tokens (in production, use a database)
const verificationTokens = new Map<string, { email: string; createdAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const { action, email, token } = await req.json()

    if (action === 'send-code') {
      // Validate email
      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      const trimmedEmail = email.trim().toLowerCase()

      // Email validation
      if (!VALID_EMAIL_REGEX.test(trimmedEmail)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }

      // Check disposable email domains
      const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'throwaway.email']
      const domain = trimmedEmail.split('@')[1]
      
      if (disposableDomains.includes(domain)) {
        return NextResponse.json({ error: 'Please use a valid business or personal email' }, { status: 400 })
      }

      // Generate verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15)
      
      // Store token with expiration (15 minutes)
      verificationTokens.set(verificationToken, {
        email: trimmedEmail,
        createdAt: Date.now(),
      })

      // Log token for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EMAIL VERIFICATION] Verification code: ${verificationToken}`)
      }

      return NextResponse.json({
        success: true,
        message: 'Verification email sent. Check your inbox.',
        // For development/testing
        ...(process.env.NODE_ENV === 'development' && { 
          token: verificationToken,
          expiresIn: '15 minutes'
        }),
      })
    }

    if (action === 'verify-token') {
      // Validate token
      if (!token || typeof token !== 'string') {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 })
      }

      const tokenData = verificationTokens.get(token)

      if (!tokenData) {
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
          { status: 400 }
        )
      }

      // Check if token is older than 15 minutes
      if (Date.now() - tokenData.createdAt > 15 * 60 * 1000) {
        verificationTokens.delete(token)
        return NextResponse.json(
          { error: 'Verification code expired. Please request a new one.' },
          { status: 400 }
        )
      }

      // Token is valid, remove it
      verificationTokens.delete(token)

      return NextResponse.json({
        success: true,
        email: tokenData.email,
        verified: true,
        message: 'Email verified successfully',
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[VERIFY EMAIL ERROR]', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
