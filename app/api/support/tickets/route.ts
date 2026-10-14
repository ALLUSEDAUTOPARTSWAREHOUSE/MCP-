import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supportTickets, supportTicketMessages } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  // Tickets contain customer support content: staff (admin) only.
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tickets = await db.select().from(supportTickets).orderBy(sql`${supportTickets.createdAt} DESC`)
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('[v0] Tickets fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // Tickets are filed as the signed-in user, never as a userId from the body.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const { subject, description, category, priority } = body

    if (!userId || !subject || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ticketNumber = `TICKET-${Date.now()}`
    const newTicket = {
      id: `ticket_${Date.now()}`,
      userId,
      ticketNumber,
      subject,
      description,
      category,
      priority: priority || 'medium',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(supportTickets).values(newTicket)

    return NextResponse.json({ ticket: newTicket }, { status: 201 })
  } catch (error) {
    console.error('[v0] Ticket creation error:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
