import { db } from '@/lib/db'
import { paymentGateways } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { VALID_TYPES } from '../route'

/**
 * PATCH /api/payment-gateways/[id]
 * Admin-only: toggle enabled/default state, edit display details, or update
 * the hosted payment link / customer instructions / required env var names.
 * No API secrets are ever accepted or stored here — gateways read their
 * credentials from Vercel project environment variables at request time.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const {
      name,
      type,
      description,
      logo,
      isEnabled,
      isDefault,
      sortOrder,
      config,
      paymentLink,
      instructions,
      envVarsRequired,
    } = body

    if (type !== undefined && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const [existing] = await db
      .select()
      .from(paymentGateways)
      .where(eq(paymentGateways.id, id))
      .limit(1)

    if (!existing) {
      return NextResponse.json({ error: 'Payment gateway not found' }, { status: 404 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (name !== undefined) updates.name = name
    if (type !== undefined) updates.type = type
    if (description !== undefined) updates.description = description
    if (logo !== undefined) updates.logo = logo
    if (isEnabled !== undefined) updates.isEnabled = Boolean(isEnabled)
    if (sortOrder !== undefined) updates.sortOrder = sortOrder
    if (paymentLink !== undefined) updates.paymentLink = paymentLink || null
    if (instructions !== undefined) updates.instructions = instructions || null
    if (envVarsRequired !== undefined) {
      updates.envVarsRequired = Array.isArray(envVarsRequired) ? envVarsRequired.filter(Boolean) : []
    }
    if (config !== undefined) {
      const prevConfig = (existing.config && typeof existing.config === 'object' ? existing.config : {}) as Record<
        string,
        unknown
      >
      updates.config = { ...prevConfig, ...(config && typeof config === 'object' ? config : {}) }
    }

    if (isDefault === true) {
      // Only one gateway can be the default; clear the others first.
      await db.update(paymentGateways).set({ isDefault: false, updatedAt: new Date() })
      updates.isDefault = true
      updates.isEnabled = true
    } else if (isDefault === false) {
      updates.isDefault = false
    }

    await db.update(paymentGateways).set(updates).where(eq(paymentGateways.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Payment gateway update error:', error)
    return NextResponse.json({ error: 'Failed to update payment gateway' }, { status: 500 })
  }
}

/**
 * DELETE /api/payment-gateways/[id]
 * Admin-only: remove a payment gateway/method from the dashboard.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db.delete(paymentGateways).where(eq(paymentGateways.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Payment gateway delete error:', error)
    return NextResponse.json({ error: 'Failed to delete payment gateway' }, { status: 500 })
  }
}
