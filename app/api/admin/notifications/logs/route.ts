import { db } from '@/lib/db'
import { notificationLogs } from '@/lib/db/schema'
import { desc, eq, lt } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET notification logs with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventType = searchParams.get('eventType')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    let query = db.select().from(notificationLogs).orderBy(desc(notificationLogs.createdAt))

    if (eventType) {
      query = query.where(eq(notificationLogs.eventType, eventType)) as any
    }

    if (status) {
      query = query.where(eq(notificationLogs.status, status)) as any
    }

    // Get total count
    const totalResult = await query
    const total = totalResult.length

    // Get paginated results
    const logs = await query.limit(limit).offset(offset)

    return NextResponse.json(
      {
        logs,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[NotificationLogsAPI] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

// DELETE old notification logs (cleanup job)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { daysOld = 30 } = body

    // Delete logs older than specified days
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    // Get logs to delete
    const logs = await db
      .select()
      .from(notificationLogs)
      .where(lt(notificationLogs.createdAt, cutoffDate))

    if (logs.length === 0) {
      return NextResponse.json({ message: 'No logs to delete', deleted: 0 }, { status: 200 })
    }

    // Note: Drizzle delete requires individual deletes or batch operations
    // For production, use the native DB client or implement batch delete
    console.log(`[NotificationLogsAPI] Found ${logs.length} logs older than ${cutoffDate} to delete`)

    return NextResponse.json(
      { 
        message: `Found ${logs.length} logs older than ${daysOld} days (delete implementation pending)`, 
        deleted: 0,
        logsToDelete: logs.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[NotificationLogsAPI] DELETE error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete logs'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
