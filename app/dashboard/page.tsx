import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, invoices, savedVehicles, wishlist } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { OrderHistory } from '@/components/dashboard/order-history'
import { SavedVehicles } from '@/components/dashboard/saved-vehicles'
import { WishlistView } from '@/components/dashboard/wishlist-view'
import { InvoiceList } from '@/components/dashboard/invoice-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  // Verify session
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/sign-in')
  }

  const userId = session.user.id

  // Fetch user data
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))

  const userInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, userId))

  const userVehicles = await db
    .select()
    .from(savedVehicles)
    .where(eq(savedVehicles.userId, userId))

  const userWishlist = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId))

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {session.user.name || session.user.email}!
            </h1>
            <p className="mt-2 text-foreground/70">
              Manage your orders, vehicles, and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground/70">Total Orders</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {userOrders.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground/70">Saved Vehicles</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {userVehicles.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground/70">Wishlist Items</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {userWishlist.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground/70">Invoices</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {userInvoices.length}
            </p>
          </div>
        </div>

        {/* Tabs Content */}
        <DashboardTabs
          orders={userOrders}
          invoices={userInvoices}
          vehicles={userVehicles}
          wishlistItems={userWishlist}
        />
      </div>
    </main>
  )
}
