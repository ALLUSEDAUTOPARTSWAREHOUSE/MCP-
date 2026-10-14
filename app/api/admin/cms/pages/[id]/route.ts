import { db } from '@/lib/db'
import { contentPages, contentRevisions, portalActivityLog } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/cms/pages/[id]
 * Fetch a single content page
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [page] = await db.select().from(contentPages).where(eq(contentPages.id, id))

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error) {
    console.error('[v0] CMS get page error:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/cms/pages/[id]
 * Update a content page
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, content, status, seoTitle, seoDescription, metaKeywords, changeDescription } = body

    // Fetch existing page
    const [existing] = await db.select().from(contentPages).where(eq(contentPages.id, id))

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Get current revision count
    const revisions = await db.select().from(contentRevisions).where(eq(contentRevisions.pageId, id))

    // Save revision
    await db.insert(contentRevisions).values({
      id: `rev_${Date.now()}`,
      pageId: id,
      title: existing.title,
      content: existing.content,
      revisionNumber: revisions.length + 1,
      changedBy: session.email,
      changeDescription,
    })

    // Update page
    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(content && { content }),
      ...(status && { status }),
      ...(seoTitle && { seoTitle }),
      ...(seoDescription && { seoDescription }),
      ...(metaKeywords && { metaKeywords }),
      updatedAt: new Date(),
    }

    await db.update(contentPages).set(updateData).where(eq(contentPages.id, id))

    // Log activity
    await db.insert(portalActivityLog).values({
      id: `log_${Date.now()}`,
      userId: session.email,
      teamType: 'admin',
      action: 'updated',
      resourceType: 'page',
      resourceId: id,
      details: { changed: Object.keys(updateData), description: changeDescription },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] CMS update page error:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/cms/pages/[id]
 * Delete a content page
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [page] = await db.select().from(contentPages).where(eq(contentPages.id, id))

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Archive instead of deleting
    await db.update(contentPages).set({ status: 'archived' }).where(eq(contentPages.id, id))

    // Log activity
    await db.insert(portalActivityLog).values({
      id: `log_${Date.now()}`,
      userId: session.email,
      teamType: 'admin',
      action: 'deleted',
      resourceType: 'page',
      resourceId: id,
      details: { title: page.title },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] CMS delete page error:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
