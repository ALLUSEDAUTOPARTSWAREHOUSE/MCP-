import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // In production: query from database
    // For now: simulate successful login
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate customer token
    const token = Buffer.from(
      JSON.stringify({
        customerId: 'cust_' + Math.random().toString(36).substr(2, 9),
        email,
        timestamp: Date.now(),
        role: 'customer',
      })
    ).toString('base64')

    console.log(`[v0] Customer login successful for: ${email}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        customerId: 'cust_' + Math.random().toString(36).substr(2, 9),
        user: {
          email,
          role: 'customer',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Customer login error:', error)

    return NextResponse.json(
      { message: 'Authentication error' },
      { status: 500 }
    )
  }
}
