import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supportTickets, supportTicketMessages } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const tickets = await db.select().from(supportTickets).orderBy(sql`${supportTickets.createdAt} DESC`)
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('[v0] Tickets fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, subject, description, category, priority } = body

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
