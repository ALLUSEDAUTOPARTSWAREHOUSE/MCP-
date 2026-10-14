'use client'

import { useState, useEffect } from 'react'
import { Package, Download, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  totalAmount: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  itemCount: number
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-500/10 text-blue-400', icon: Clock },
  shipped: { label: 'Shipped', color: 'bg-purple-500/10 text-purple-400', icon: Package },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400', icon: AlertCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status === filter
  })

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 mx-auto text-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p className="text-foreground/60 mb-6">You haven't placed any orders yet.</p>
        <Button size="lg">Start Shopping</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-foreground/60">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-foreground/60 hover:bg-white/20'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = statusConfig[order.status]
          const Icon = statusInfo.icon
          return (
            <div
              key={order.id}
              className="p-6 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <div>
                      <p className="text-sm text-foreground/60">Order Number</p>
                      <p className="font-bold text-lg">{order.orderNumber}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm font-semibold ${statusInfo.color}`}>
                      <Icon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-foreground/60">Date</p>
                      <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Items</p>
                      <p className="font-semibold">{order.itemCount} item(s)</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Total</p>
                      <p className="font-semibold text-blue-400">${parseFloat(order.totalAmount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {order.status === 'delivered' && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
