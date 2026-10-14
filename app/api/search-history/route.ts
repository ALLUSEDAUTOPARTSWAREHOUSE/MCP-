import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { searchHistory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const history = await db.query.searchHistory.findMany({
      where: eq(searchHistory.userId, session.user.id),
      orderBy: (history, { desc }) => [desc(history.createdAt)],
      limit: 100,
    })

    return Response.json(history)
  } catch (error) {
    console.error('[v0] Search history GET error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const newEntry = await db
      .insert(searchHistory)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        query: body.query,
        category: body.category || null,
        resultsCount: body.resultsCount || 0,
        createdAt: new Date(),
      })
      .returning()

    return Response.json(newEntry[0])
  } catch (error) {
    console.error('[v0] Search history POST error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db
      .delete(searchHistory)
      .where(eq(searchHistory.userId, session.user.id))

    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] Search history DELETE error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
