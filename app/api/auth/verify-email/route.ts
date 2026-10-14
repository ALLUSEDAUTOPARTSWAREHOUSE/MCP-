import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, verification } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Look up the verification record by email and code
    const verificationRecord = await db
      .select()
      .from(verification)
      .where(eq(verification.identifier, email))
      .then(records => records.find(r => r.value === code))

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Check if code has expired
    if (new Date() > verificationRecord.expiresAt) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Mark user as verified
    await db
      .update(user)
      .set({ emailVerified: true })
      .where(eq(user.email, email))

    // Delete the verification record
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id))

    // Trigger userSignup notification (sends welcome email)
    await fetch(`${req.nextUrl.origin}/api/notifications/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'userSignup',
        email,
      }),
    }).catch(err => console.error('[v0] Failed to dispatch notification:', err))

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Email verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
