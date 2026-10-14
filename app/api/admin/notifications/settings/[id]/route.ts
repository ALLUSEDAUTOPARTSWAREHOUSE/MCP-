import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notificationSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PATCH update a specific notification setting
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: settingId } = await params
    const body = await request.json()
    const { enabled, recipients } = body

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (enabled !== undefined) {
      updateData.enabled = enabled
    }

    if (recipients !== undefined) {
      // Parse recipients if it's a string
      let parsedRecipients = recipients
      if (typeof recipients === 'string') {
        parsedRecipients = recipients.split(',').map((r: string) => r.trim())
      }

      // Validate email addresses
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (Array.isArray(parsedRecipients)) {
        const invalidEmails = parsedRecipients.filter((email: string) => !emailRegex.test(email))
        if (invalidEmails.length > 0) {
          return NextResponse.json(
            { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
            { status: 400 }
          )
        }
      }

      updateData.recipients = parsedRecipients
    }

    const result = await db
      .update(notificationSettings)
      .set(updateData)
      .where(eq(notificationSettings.id, settingId))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[NotificationAPI] PATCH error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update setting'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
