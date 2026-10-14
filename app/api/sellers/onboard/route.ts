import { db } from '@/lib/db'
import { sellerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { businessName, businessLicense, taxId, bankAccount } = await req.json()

    // Check if seller profile already exists
    const existing = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, session.user.id))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Seller profile already exists' }, { status: 409 })
    }

    // Create seller profile
    const seller = await db
      .insert(sellerProfiles)
      .values({
        id: `seller_${Date.now()}`,
        userId: session.user.id,
        businessName,
        businessLicense,
        taxId,
        bankAccount,
        status: 'pending',
        verificationStatus: 'unverified',
      })
      .returning()

    return NextResponse.json({ seller: seller[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Seller onboard error:', error)
    return NextResponse.json({ error: 'Failed to create seller profile' }, { status: 500 })
  }
}
