import { db } from '@/lib/db'
import { paymentGateways } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export const VALID_TYPES = ['card', 'wallet', 'bank', 'link', 'offline']

/**
 * GET /api/payment-gateways
 * Public: list configured payment gateways/methods (used by checkout).
 * Returns only customer-facing, non-secret fields (name, type, description,
 * hosted payment link, instructions, display config). Admins additionally
 * see `envVarsRequired` (the env var *names* each gateway depends on —
 * never values; actual secrets always live in Vercel project environment
 * variables, not in this table).
 */
export async function GET() {
  try {
    const session = await getAdminSession()
    const isAdmin = Boolean(session)

    const rows = await db
      .select()
      .from(paymentGateways)
      .orderBy(asc(paymentGateways.sortOrder))

    const gateways = rows.map((row) =>
      isAdmin
        ? row
        : {
            id: row.id,
            name: row.name,
            slug: row.slug,
            type: row.type,
            description: row.description,
            logo: row.logo,
            isEnabled: row.isEnabled,
            isDefault: row.isDefault,
            sortOrder: row.sortOrder,
            config: row.config,
            paymentLink: row.paymentLink,
            instructions: row.instructions,
          }
    )

    return NextResponse.json({ gateways })
  } catch (error) {
    console.error('[v0] Payment gateways list error:', error)
    return NextResponse.json({ error: 'Failed to fetch payment gateways' }, { status: 500 })
  }
}

/**
 * POST /api/payment-gateways
 * Admin-only: add a new payment gateway/method to the dashboard — any type
 * (card, wallet, bank/wire, hosted payment link / EPS, or offline/manual) —
 * with a hosted payment link, customer-facing instructions, and the env var
 * names its API keys/secrets should be configured under in the project's
 * environment variables (never stored in this table).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, type, description, logo, isEnabled, config, paymentLink, instructions, envVarsRequired } =
      body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields: name, slug' }, { status: 400 })
    }

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const newGateway = {
      id: `gtw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      slug,
      type: type || 'card',
      description: description || null,
      logo: logo || null,
      isEnabled: Boolean(isEnabled),
      isDefault: false,
      sortOrder: 99,
      config: config && typeof config === 'object' ? config : {},
      paymentLink: paymentLink || null,
      instructions: instructions || null,
      envVarsRequired: Array.isArray(envVarsRequired) ? envVarsRequired.filter(Boolean) : [],
    }

    await db.insert(paymentGateways).values(newGateway)

    return NextResponse.json({ gateway: newGateway }, { status: 201 })
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'A gateway with that slug already exists' }, { status: 400 })
    }
    console.error('[v0] Payment gateway create error:', error)
    return NextResponse.json({ error: 'Failed to create payment gateway' }, { status: 500 })
  }
}
