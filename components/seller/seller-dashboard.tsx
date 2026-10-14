'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import { getSellerDashboard } from '@/app/actions/marketplace'
import { BarChart3, Plus, LogOut, DollarSign, ShoppingCart, Star } from 'lucide-react'
import Link from 'next/link'

export function SellerDashboard() {
  const { data: session } = useSession()
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getSellerDashboard()
        if (result.success) {
          setDashboard(result)
        }
      } catch (error) {
        console.error('[v0] Failed to load dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  const stats = dashboard?.stats || {}

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{dashboard?.seller?.businessName}</h1>
          <p className="text-muted-foreground">Manage your inventory and earnings</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/seller/listings/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            New Listing
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
              <p className="text-3xl font-bold">{stats.activeListings || 0}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p className="text-3xl font-bold">${parseFloat(stats.totalSales || '0').toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{parseFloat(stats.rating || '0').toFixed(1)}</p>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">({stats.totalReviews || 0} reviews)</p>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Payouts</p>
              <p className="text-3xl font-bold">${(dashboard?.pendingPayouts || []).length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2 border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-6">Recent Sales</h2>
          {(dashboard?.recentSales || []).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No sales yet</p>
          ) : (
            <div className="space-y-4">
              {(dashboard?.recentSales || []).map((sale: any) => (
                <div key={sale.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition">
                  <div>
                    <p className="font-semibold">{sale.type === 'sale' ? 'New Sale' : 'Commission'}</p>
                    <p className="text-sm text-muted-foreground">{sale.description}</p>
                  </div>
                  <p className={`font-semibold ${parseFloat(sale.amount || '0') > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(sale.amount || '0') > 0 ? '+' : ''}${parseFloat(sale.amount || '0').toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Reviews */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-6">Latest Reviews</h2>
          {(dashboard?.reviews || []).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {(dashboard?.reviews || []).slice(0, 5).map((review: any) => (
                <div key={review.id} className="pb-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold">{review.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 rounded-lg border border-border bg-card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/seller/listings"
            className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition text-center text-sm font-semibold"
          >
            View Listings
          </Link>
          <Link
            href="/seller/settings"
            className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition text-center text-sm font-semibold"
          >
            Settings
          </Link>
          <Link
            href="/seller/payouts"
            className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition text-center text-sm font-semibold"
          >
            Payout History
          </Link>
          <Link
            href="/seller/support"
            className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition text-center text-sm font-semibold"
          >
            Get Help
          </Link>
        </div>
      </div>
    </div>
  )
}
