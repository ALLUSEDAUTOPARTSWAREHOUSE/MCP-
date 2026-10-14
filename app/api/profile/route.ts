import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRecord = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    })

    if (!userRecord) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({
      name: userRecord.name,
      email: userRecord.email,
      image: userRecord.image,
      phone: userRecord.phone || '',
      address: userRecord.address || '',
      city: userRecord.city || '',
      state: userRecord.state || '',
      zip: userRecord.zip || '',
    })
  } catch (error) {
    console.error('[v0] Profile GET error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    await db
      .update(user)
      .set({
        name: body.name,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zip: body.zip,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))

    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] Profile PUT error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
