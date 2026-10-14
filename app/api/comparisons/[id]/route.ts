import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { savedComparisons } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await db
      .delete(savedComparisons)
      .where(
        and(
          eq(savedComparisons.id, id),
          eq(savedComparisons.userId, session.user.id)
        )
      )

    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] Comparisons delete error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
