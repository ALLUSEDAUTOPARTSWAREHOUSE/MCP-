'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, ShoppingCart, CheckCircle, Clock } from 'lucide-react'

export function TeamBuyingPortal() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/teams', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setTeams(data.teams || [])
        }
      } catch (error) {
        console.error('[v0] Teams fetch error:', error)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    if (!selectedTeam) return
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/teams/${selectedTeam}/bulk-orders`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error('[v0] Orders fetch error:', error)
      }
    }
    fetchOrders()
  }, [selectedTeam])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-yellow-500/20 text-yellow-700',
      pending: 'bg-blue-500/20 text-blue-700',
      approved: 'bg-green-500/20 text-green-700',
      completed: 'bg-gray-500/20 text-gray-700',
    }
    return colors[status] || colors.draft
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Team Buying Portal
        </h2>
      </div>

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.length === 0 ? (
          <p className="col-span-full text-muted-foreground text-center py-8">
            No teams found. Create a team to get started.
          </p>
        ) : (
          teams.map((team: any) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedTeam === team.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{team.name}</h3>
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              {team.description && <p className="text-sm text-muted-foreground mb-3">{team.description}</p>}
              <div className="text-sm text-muted-foreground">
                <p>Owner: {team.ownerId}</p>
                <p>Status: <span className="text-foreground font-medium">{team.status}</span></p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTeam && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Team Orders</h3>
            <button
              onClick={() => setShowNewOrder(!showNewOrder)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          </div>

          {showNewOrder && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h4 className="font-semibold">Create Bulk Order</h4>
              <div className="space-y-3">
                <textarea
                  placeholder="Add items (one per line: product_id quantity)"
                  value={orderItems.join('\n')}
                  onChange={(e) => setOrderItems(e.target.value.split('\n'))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background h-32"
                />
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
                    Create Order
                  </button>
                  <button
                    onClick={() => setShowNewOrder(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              orders.map((order: any) => (
                <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-semibold">Order #{order.id.slice(0, 8)}</h5>
                      <p className="text-sm text-muted-foreground">{order.quantity} items</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                    </div>
                    {order.discount && (
                      <div>
                        <p className="text-muted-foreground">Discount</p>
                        <p className="font-semibold text-success">-${parseFloat(order.discount).toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  {order.approvedAt && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Approved on {new Date(order.approvedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
