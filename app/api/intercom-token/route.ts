import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json()
    
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
      user_id: userId,
    }
    
    if (email) {
      payload.email = email
    }
    if (name) {
      payload.name = name
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
