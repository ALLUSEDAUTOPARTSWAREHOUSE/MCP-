import { db } from '@/lib/db'
import { staffMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

const VALID_ROLES = ['sales_agent', 'support_team', 'developer_team']

/**
 * PATCH /api/admin/staff/[id]
 * Update a staff member's details, role, or status.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, email, phone, role, department, title, status, notes } = body

    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Role must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email
    if (phone !== undefined) updates.phone = phone
    if (role !== undefined) updates.role = role
    if (department !== undefined) updates.department = department
    if (title !== undefined) updates.title = title
    if (status !== undefined) updates.status = status
    if (notes !== undefined) updates.notes = notes

    await db.update(staffMembers).set(updates).where(eq(staffMembers.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Staff update error:', error)
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/staff/[id]
 * Remove a staff member from the directory.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db.delete(staffMembers).where(eq(staffMembers.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Staff delete error:', error)
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 })
  }
}
