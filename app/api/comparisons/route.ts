import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { savedComparisons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const comparisons = await db.query.savedComparisons.findMany({
      where: eq(savedComparisons.userId, session.user.id),
      orderBy: (comparisons, { desc }) => [desc(comparisons.createdAt)],
    })

    const formatted = comparisons.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      productIds: c.productIds || [],
      productCount: (c.productIds || []).length,
      createdAt: c.createdAt,
    }))

    return Response.json(formatted)
  } catch (error) {
    console.error('[v0] Comparisons GET error:', error)
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

    const newComparison = await db
      .insert(savedComparisons)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        name: body.name,
        description: body.description || null,
        productIds: body.productIds || [],
        metadata: body.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    const productIds = (newComparison[0].productIds as string[]) || []
    return Response.json({
      id: newComparison[0].id,
      name: newComparison[0].name,
      description: newComparison[0].description,
      productIds: productIds,
      productCount: productIds.length,
      createdAt: newComparison[0].createdAt,
    })
  } catch (error) {
    console.error('[v0] Comparisons POST error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
