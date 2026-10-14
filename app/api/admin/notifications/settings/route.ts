import { db } from '@/lib/db'
import { notificationSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET all notification settings
export async function GET() {
  try {
    const settings = await db.select().from(notificationSettings)
    return NextResponse.json({ settings }, { status: 200 })
  } catch (error) {
    console.error('[NotificationAPI] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// UPDATE notification settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventType, enabled, recipients, subject, description } = body

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 })
    }

    // Parse recipients if it's a string
    let parsedRecipients = recipients
    if (typeof recipients === 'string') {
      parsedRecipients = recipients.split(',').map((r: string) => r.trim())
    }

    // Validate recipients are email addresses
    if (Array.isArray(parsedRecipients)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = parsedRecipients.filter((email: string) => !emailRegex.test(email))
      if (invalidEmails.length > 0) {
        return NextResponse.json(
          { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Update or create setting
    const existing = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.eventType, eventType))
      .limit(1)

    let result
    if (existing.length > 0) {
      result = await db
        .update(notificationSettings)
        .set({
          enabled: enabled !== undefined ? enabled : existing[0].enabled,
          recipients: parsedRecipients,
          subject: subject || existing[0].subject,
          description: description || existing[0].description,
          updatedAt: new Date(),
        })
        .where(eq(notificationSettings.eventType, eventType))
        .returning()
    } else {
      // Create new setting
      const { v4: uuid } = await import('uuid')
      result = await db
        .insert(notificationSettings)
        .values({
          id: uuid(),
          eventType,
          enabled: enabled ?? true,
          recipients: parsedRecipients,
          subject: subject || eventType,
          description: description || '',
        })
        .returning()
    }

    return NextResponse.json({ setting: result[0] }, { status: 200 })
  } catch (error) {
    console.error('[NotificationAPI] PUT error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
