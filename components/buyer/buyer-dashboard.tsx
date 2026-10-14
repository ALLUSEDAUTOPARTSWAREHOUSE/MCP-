'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import { getBuyerOrders } from '@/app/actions/marketplace'
import { ShoppingBag, LogOut, Star } from 'lucide-react'
import Link from 'next/link'

export function BuyerDashboard() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await getBuyerOrders()
        if (result.success) {
          setOrders(result.orders || [])
        }
      } catch (error) {
        console.error('[v0] Failed to load orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome, {session?.user?.name}</h1>
          <p className="text-muted-foreground">Manage your purchases and reviews</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-primary mb-2">{orders.length}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-green-500 mb-2">{orders.filter((o) => o.paymentStatus === 'paid').length}</div>
          <div className="text-sm text-muted-foreground">Completed Orders</div>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-orange-500 mb-2">{orders.filter((o) => o.status === 'pending').length}</div>
          <div className="text-sm text-muted-foreground">Pending Orders</div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5" />
          <h2 className="text-2xl font-semibold">Your Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link href="/shop" className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-border hover:border-primary transition">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold">${parseFloat(order.total || '0').toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-500/10 text-green-700'
                          : 'bg-orange-500/10 text-orange-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                      {order.reviewed && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Items ({order.items.length})</p>
                    <div className="space-y-2">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="text-sm text-muted-foreground">
                          {item.productId} x{item.quantity} @ ${parseFloat(item.unitPrice || '0').toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {order.paymentStatus === 'paid' && !order.reviewed && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      href={`/buyer/orders/${order.id}/review`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Write Review
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
