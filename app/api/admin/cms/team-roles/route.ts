import { db } from '@/lib/db'
import { teamRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/cms/team-roles
 * Fetch team roles for users
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const teamType = searchParams.get('teamType')

    const conditions: any[] = []
    if (userId) conditions.push(eq(teamRoles.userId, userId))
    if (teamType) conditions.push(eq(teamRoles.teamType, teamType))

    let query: any = db.select().from(teamRoles)
    
    for (const condition of conditions) {
      query = query.where(condition)
    }

    const roles = await query

    return NextResponse.json({ roles })
  } catch (error) {
    console.error('[v0] Team roles error:', error)
    return NextResponse.json({ error: 'Failed to fetch team roles' }, { status: 500 })
  }
}

/**
 * POST /api/admin/cms/team-roles
 * Assign a user to a team role
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { userId, teamType, role } = body

    if (!userId || !teamType || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, teamType, role' },
        { status: 400 }
      )
    }

    // Check if role already exists
    const [existing] = await db
      .select()
      .from(teamRoles)
      .where(
        eq(teamRoles.userId, userId) && eq(teamRoles.teamType, teamType)
      )

    if (existing) {
      // Update existing role
      await db
        .update(teamRoles)
        .set({ role, status: 'active' })
        .where(eq(teamRoles.id, existing.id))

      return NextResponse.json({ role: { ...existing, role, status: 'active' } })
    }

    const newRole = {
      id: `role_${Date.now()}`,
      userId,
      teamType,
      role,
      status: 'active',
    }

    await db.insert(teamRoles).values(newRole)

    return NextResponse.json({ role: newRole }, { status: 201 })
  } catch (error) {
    console.error('[v0] Team role creation error:', error)
    return NextResponse.json({ error: 'Failed to create team role' }, { status: 500 })
  }
}
