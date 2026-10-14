import { db } from '@/lib/db'
import { salesContent, portalActivityLog } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/cms/sales
 * Fetch all sales content
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contentType = searchParams.get('contentType')
    const status = searchParams.get('status')
    const audience = searchParams.get('audience')

    const conditions: any[] = []
    if (contentType) conditions.push(eq(salesContent.contentType, contentType))
    if (status) conditions.push(eq(salesContent.status, status))
    if (audience) conditions.push(eq(salesContent.targetAudience, audience))

    let query: any = db.select().from(salesContent)
    
    for (const condition of conditions) {
      query = query.where(condition)
    }

    const content = await query

    return NextResponse.json({ content })
  } catch (error) {
    console.error('[v0] Sales content error:', error)
    return NextResponse.json({ error: 'Failed to fetch sales content' }, { status: 500 })
  }
}

/**
 * POST /api/admin/cms/sales
 * Create new sales content
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      contentType,
      content,
      images,
      targetAudience,
      startDate,
      endDate,
    } = body

    if (!title || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, contentType' },
        { status: 400 }
      )
    }

    const newContent = {
      id: `sales_${Date.now()}`,
      title,
      contentType,
      content,
      images,
      targetAudience,
      status: 'draft',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      editedBy: session.email,
    }

    await db.insert(salesContent).values(newContent)

    // Log activity
    await db.insert(portalActivityLog).values({
      id: `log_${Date.now()}`,
      userId: session.email,
      teamType: 'sales',
      action: 'created',
      resourceType: 'sales_content',
      resourceId: newContent.id,
      details: { title, contentType, audience: targetAudience },
    })

    return NextResponse.json({ content: newContent }, { status: 201 })
  } catch (error) {
    console.error('[v0] Sales content create error:', error)
    return NextResponse.json({ error: 'Failed to create sales content' }, { status: 500 })
  }
}
