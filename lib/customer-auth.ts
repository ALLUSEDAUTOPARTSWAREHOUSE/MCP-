import { createHmac, createHash, timingSafeEqual } from 'crypto'

export const CUSTOMER_COOKIE = 'customerSession'
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface CustomerSession {
  customerId: string
  email: string
  exp: number // unix seconds
}

function getSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('CUSTOMER_SESSION_SECRET must be set (min 32 chars)')
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function customerIdFor(email: string): string {
  return 'cust_' + createHash('sha256').update(email).digest('hex').slice(0, 12)
}

export function createCustomerToken(email: string): string {
  const session: CustomerSession = {
    customerId: customerIdFor(email),
    email,
    exp: Math.floor(Date.now() / 1000) + CUSTOMER_SESSION_MAX_AGE,
  }
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyCustomerToken(token: string | undefined | null): CustomerSession | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as CustomerSession
    if (!session.email || !session.exp || session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export const customerCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}
