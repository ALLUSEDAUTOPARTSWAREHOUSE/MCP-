'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react'

export function SupportTeamPortal() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [tickets, setTickets] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/support/tickets', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setTickets(data.tickets || [])
        }
      } catch (error) {
        console.error('[v0] Tickets fetch error:', error)
      }
    }
    fetchTickets()
  }, [])

  useEffect(() => {
    if (!selectedTicket) return
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/support/tickets/${selectedTicket}/messages`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
        }
      } catch (error) {
        console.error('[v0] Messages fetch error:', error)
      }
    }
    fetchMessages()
  }, [selectedTicket])

  const selectedTicketData = tickets.find((t: any) => t.id === selectedTicket)

  const handleReply = async () => {
    if (!replyMessage.trim()) return

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: replyMessage }),
      })

      if (!res.ok) throw new Error('Failed to send reply')

      setReplyMessage('')
      // Refresh messages
      const refreshRes = await fetch(`/api/support/tickets/${selectedTicket}/messages`, { credentials: 'include' })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('[v0] Reply error:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      open: <AlertCircle className="w-4 h-4 text-blue-500" />,
      in_progress: <Clock className="w-4 h-4 text-yellow-500" />,
      resolved: <CheckCircle className="w-4 h-4 text-green-500" />,
      closed: <CheckCircle className="w-4 h-4 text-gray-500" />,
    }
    return icons[status] || icons.open
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-500/20 text-blue-700',
      medium: 'bg-yellow-500/20 text-yellow-700',
      high: 'bg-orange-500/20 text-orange-700',
      critical: 'bg-red-500/20 text-red-700',
    }
    return colors[priority] || colors.medium
  }

  const filteredTickets = tickets.filter((ticket: any) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="grid grid-cols-3 gap-6 min-h-screen">
      {/* Tickets List */}
      <div className="col-span-1 border-r border-border space-y-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Support Tickets
          </h2>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No tickets found</p>
          ) : (
            filteredTickets.map((ticket: any) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTicket === ticket.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm line-clamp-1">{ticket.subject}</h4>
                  {getStatusIcon(ticket.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">#{ticket.ticketNumber}</p>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  {ticket.assignedTo && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {ticket.assignedTo === 'me' ? 'Assigned to you' : 'Assigned'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Details */}
      <div className="col-span-2 space-y-4">
        {selectedTicketData ? (
          <>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedTicketData.subject}</h3>
                  <p className="text-sm text-muted-foreground">#{selectedTicketData.ticketNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicketData.priority)}`}>
                  {selectedTicketData.priority}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold flex items-center gap-2">
                    {getStatusIcon(selectedTicketData.status)}
                    {selectedTicketData.status}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-semibold">{selectedTicketData.category}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedTicketData.description}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
              ) : (
                messages.map((msg: any) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{msg.userId}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Reply Form */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <textarea
                placeholder="Type your response..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background h-24 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  )
}
