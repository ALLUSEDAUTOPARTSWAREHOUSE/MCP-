import { db } from '@/lib/db'
import { supportContent, portalActivityLog } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/cms/support
 * Fetch all support content (FAQs, policies, guides)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contentType = searchParams.get('contentType')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const conditions: any[] = []
    if (contentType) conditions.push(eq(supportContent.contentType, contentType))
    if (category) conditions.push(eq(supportContent.category, category))
    if (status) conditions.push(eq(supportContent.status, status))

    let query: any = db.select().from(supportContent)
    
    for (const condition of conditions) {
      query = query.where(condition)
    }

    const content = await query

    return NextResponse.json({ content })
  } catch (error) {
    console.error('[v0] Support content error:', error)
    return NextResponse.json({ error: 'Failed to fetch support content' }, { status: 500 })
  }
}

/**
 * POST /api/admin/cms/support
 * Create new support content
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
      category,
      content,
      relatedPages,
      priority,
    } = body

    if (!title || !contentType || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, contentType, category' },
        { status: 400 }
      )
    }

    const newContent = {
      id: `support_${Date.now()}`,
      title,
      contentType,
      category,
      content,
      relatedPages,
      status: 'published',
      priority: priority || 0,
      editedBy: session.email,
    }

    await db.insert(supportContent).values(newContent)

    // Log activity
    await db.insert(portalActivityLog).values({
      id: `log_${Date.now()}`,
      userId: session.email,
      teamType: 'support',
      action: 'created',
      resourceType: 'support_content',
      resourceId: newContent.id,
      details: { title, contentType, category },
    })

    return NextResponse.json({ content: newContent }, { status: 201 })
  } catch (error) {
    console.error('[v0] Support content create error:', error)
    return NextResponse.json({ error: 'Failed to create support content' }, { status: 500 })
  }
}
