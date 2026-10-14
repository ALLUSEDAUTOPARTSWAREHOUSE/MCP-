import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    // The identity comes from the signed-in session, never from the request
    // body: a token for an arbitrary user_id would let anyone open that
    // customer's Intercom conversations.
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get API secret from environment variables
    const apiSecret = process.env.INTERCOM_API_SECRET

    if (!apiSecret) {
      return NextResponse.json(
        { error: 'Intercom API secret not configured' },
        { status: 500 }
      )
    }

    // Build payload with optional fields
    const payload: Record<string, any> = {
      user_id: session.user.id,
    }

    if (session.user.email) {
      payload.email = session.user.email
    }
    if (session.user.name) {
      payload.name = session.user.name
    }

    // Generate secure JWT token (valid for 1 hour)
    const token = jwt.sign(payload, apiSecret, {
      expiresIn: '1h',
      algorithm: 'HS256'
    })

    return NextResponse.json({ token })
  } catch (error) {
    console.error('[Intercom] JWT generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate Intercom token' },
      { status: 500 }
    )
  }
}
