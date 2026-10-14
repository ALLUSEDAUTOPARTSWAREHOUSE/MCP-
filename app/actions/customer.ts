'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { customers, savedVehicles, wishlist, orders } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveVehicle(vehicleData: {
  year: number
  make: string
  model: string
  vin?: string
  engine?: string
  transmission?: string
}) {
  const userId = await getUserId()
  const id = `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  await db.insert(savedVehicles).values({
    id,
    userId,
    year: vehicleData.year,
    make: vehicleData.make,
    model: vehicleData.model,
    vin: vehicleData.vin || null,
    engine: vehicleData.engine || null,
    transmission: vehicleData.transmission || null,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any)

  revalidatePath('/dashboard')
  return { success: true, id }
}

export async function addToWishlist(productId: string) {
  const userId = await getUserId()
  const id = `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  await db.insert(wishlist).values({
    id,
    userId,
    productId,
  })

  revalidatePath('/dashboard')
  return { success: true }
}

export async function removeFromWishlist(productId: string) {
  const userId = await getUserId()

  await db
    .delete(wishlist)
    .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateCustomerProfile(data: {
  firstName?: string
  lastName?: string
  phone?: string
  businessName?: string
  businessType?: string
  taxId?: string
}) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(customers)
    .where(eq(customers.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(customers)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(customers.userId, userId))
  } else {
    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await db.insert(customers).values({
      id: customerId,
      userId,
      email: '',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
  }

  revalidatePath('/dashboard')
  return { success: true }
}
