import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { teams, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const allTeams = await db.select().from(teams)
    return NextResponse.json({ teams: allTeams })
  } catch (error) {
    console.error('[v0] Teams fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, ownerId, description, businessId } = body

    if (!name || !ownerId) {
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
