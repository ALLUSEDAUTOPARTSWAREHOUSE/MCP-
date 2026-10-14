import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { teams, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function GET(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Only the teams the signed-in user belongs to.
    const myTeams = await db
      .select({ team: teams })
      .from(teams)
      .innerJoin(teamMembers, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId))
    return NextResponse.json({ teams: myTeams.map((row) => row.team) })
  } catch (error) {
    console.error('[v0] Teams fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // The owner is always the signed-in user, never an ownerId from the body.
  const ownerId = await getUserId()
  if (!ownerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, businessId } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newTeam = {
      id: `team_${Date.now()}`,
      name,
      ownerId,
      description,
      businessId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(teams).values(newTeam)

    // Add owner as team member
    await db.insert(teamMembers).values({
      id: `tm_${Date.now()}`,
      teamId: newTeam.id,
      userId: ownerId,
      role: 'owner',
      joinedAt: new Date(),
    })

    return NextResponse.json({ team: newTeam }, { status: 201 })
  } catch (error) {
    console.error('[v0] Team creation error:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}
