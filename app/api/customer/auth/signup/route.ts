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

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // In production: check if email already exists in database
    // For now: simulate account creation

    // Generate customer token
    const customerId = 'cust_' + Math.random().toString(36).substr(2, 9)
    const token = Buffer.from(
      JSON.stringify({
        customerId,
        email,
        timestamp: Date.now(),
        role: 'customer',
      })
    ).toString('base64')

    console.log(`[v0] New customer account created: ${email}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        token,
        customerId,
        user: {
          email,
          role: 'customer',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Customer signup error:', error)

    return NextResponse.json(
      { message: 'Signup error' },
      { status: 500 }
    )
  }
}
