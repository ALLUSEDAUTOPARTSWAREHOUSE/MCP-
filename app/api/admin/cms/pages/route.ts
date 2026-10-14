import { db } from '@/lib/db'
import { contentPages, portalActivityLog } from '@/lib/db/schema'
import { eq, like } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/cms/pages
 * Fetch all content pages with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const contentType = searchParams.get('contentType')

    const conditions: any[] = []
    if (category) conditions.push(eq(contentPages.category, category))
    if (status) conditions.push(eq(contentPages.status, status))
    if (contentType) conditions.push(eq(contentPages.contentType, contentType))

    let query: any = db.select().from(contentPages)
    
    for (const condition of conditions) {
      query = query.where(condition)
    }

    const pages = await query

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('[v0] CMS pages error:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

/**
 * POST /api/admin/cms/pages
 * Create a new content page
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      slug,
      title,
      description,
      content,
      contentType,
      category,
      teamType,
      seoTitle,
      seoDescription,
      metaKeywords,
      featuredImage,
    } = body

    if (!slug || !title || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, contentType' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db
      .select()
      .from(contentPages)
      .where(eq(contentPages.slug, slug))

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const newPage = {
      id: `page_${Date.now()}`,
      slug,
      title,
      description,
      content,
      contentType,
      category,
      teamType,
      seoTitle,
      seoDescription,
      metaKeywords,
      featuredImage,
      authorId: session.email,
      status: 'draft',
    }

    await db.insert(contentPages).values(newPage)

    // Log activity
    await db.insert(portalActivityLog).values({
      id: `log_${Date.now()}`,
      userId: session.email,
      teamType: 'admin',
      action: 'created',
      resourceType: 'page',
      resourceId: newPage.id,
      details: { title, contentType },
    })

    return NextResponse.json({ page: newPage }, { status: 201 })
  } catch (error) {
    console.error('[v0] CMS create page error:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
