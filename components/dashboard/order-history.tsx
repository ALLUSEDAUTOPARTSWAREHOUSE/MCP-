'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function OrderHistory({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-foreground/70">No orders yet</p>
        <Button asChild className="mt-4">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700'
      case 'cancelled':
        return 'bg-red-500/20 text-red-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
        >
          <div className="flex-1">
            <p className="font-semibold text-foreground">{order.orderNumber}</p>
            <p className="text-sm text-foreground/70">
              {format(new Date(order.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">${order.total}</p>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
          <Button asChild variant="outline" className="ml-4">
            <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
          </Button>
        </div>
      ))}
    </div>
  )
}
