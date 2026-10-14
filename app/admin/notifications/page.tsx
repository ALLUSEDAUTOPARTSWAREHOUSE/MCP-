'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface NotificationSetting {
  id: string
  eventType: string
  enabled: boolean
  recipients: string[]
  subject: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface NotificationLog {
  id: string
  eventType: string
  recipients: string[]
  subject: string
  status: 'pending' | 'sent' | 'failed'
  failureReason?: string
  referenceId?: string
  referenceType?: string
  attemptCount: number
  lastAttemptAt?: Date
  createdAt: Date
}

const eventTypes = [
  { key: 'newCustomer', label: 'New Customer', icon: '👤' },
  { key: 'newOrder', label: 'New Order', icon: '📦' },
  { key: 'paymentSuccess', label: 'Payment Success', icon: '✅' },
  { key: 'paymentFailure', label: 'Payment Failure', icon: '❌' },
  { key: 'highRiskOrder', label: 'High-Risk Order', icon: '⚠️' },
  { key: 'chargeback', label: 'Chargeback', icon: '💳' },
  { key: 'refund', label: 'Refund', icon: '↩️' },
  { key: 'contactForm', label: 'Contact Form', icon: '📧' },
  { key: 'quoteRequest', label: 'Quote Request', icon: '💼' },
  { key: 'ticketCreated', label: 'Support Ticket', icon: '🎫' },
  { key: 'shipmentNotification', label: 'Shipment', icon: '🚚' },
  { key: 'dailyReport', label: 'Daily Report', icon: '📊' },
  { key: 'weeklyReport', label: 'Weekly Report', icon: '📈' },
  { key: 'aiChatEscalation', label: 'AI Chat Escalation', icon: '🤖' },
]

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([])
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingRecipients, setEditingRecipients] = useState<string>('')

  useEffect(() => {
    fetchSettings()
    fetchLogs()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/notifications/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('[NotificationsPage] Error fetching settings:', error)
      toast.error('Failed to load notification settings')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/notifications/logs?limit=50')
      if (!response.ok) throw new Error('Failed to fetch logs')
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('[NotificationsPage] Error fetching logs:', error)
    }
  }

  const handleToggle = async (settingId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/notifications/settings/${settingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })

      if (!response.ok) throw new Error('Failed to update setting')
      toast.success('Setting updated')
      fetchSettings()
    } catch (error) {
      toast.error('Failed to update setting')
    }
  }

  const handleSaveRecipients = async (settingId: string) => {
    try {
      const recipients = editingRecipients.split(',').map((r) => r.trim()).filter(Boolean)
      const response = await fetch(`/api/admin/notifications/settings/${settingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients }),
      })

      if (!response.ok) throw new Error('Failed to update recipients')
      toast.success('Recipients updated')
      setEditingId(null)
      fetchSettings()
    } catch (error) {
      toast.error('Failed to update recipients')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Bell className="w-8 h-8" />
          Notification Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure which notifications are enabled and who receives them
        </p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings ({settings.length})</TabsTrigger>
          <TabsTrigger value="logs">Logs ({logs.length})</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading settings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventTypes.map((eventType) => {
                const setting = settings.find((s) => s.eventType === eventType.key)
                return (
                  <Card key={eventType.key}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{eventType.icon}</span>
                          {eventType.label}
                        </CardTitle>
                        <Switch
                          checked={setting?.enabled ?? false}
                          onCheckedChange={(enabled) =>
                            setting && handleToggle(setting.id, enabled)
                          }
                        />
                      </div>
                      <CardDescription className="text-xs">{eventType.key}</CardDescription>
                    </CardHeader>

                    {setting && (
                      <CardContent className="space-y-3">
                        {editingId === setting.id ? (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold">Recipients (comma-separated):</label>
                            <Input
                              value={editingRecipients}
                              onChange={(e) => setEditingRecipients(e.target.value)}
                              placeholder="email1@example.com, email2@example.com"
                              className="text-xs"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveRecipients(setting.id)}
                                className="text-xs"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                className="text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Recipients:</p>
                              <div className="text-xs space-y-1">
                                {setting.recipients && setting.recipients.length > 0 ? (
                                  setting.recipients.map((r) => (
                                    <p key={r} className="bg-muted px-2 py-1 rounded">
                                      {r}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-muted-foreground italic">No recipients</p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(setting.id)
                                setEditingRecipients(
                                  setting.recipients ? setting.recipients.join(', ') : ''
                                )
                              }}
                              className="w-full text-xs"
                            >
                              Edit Recipients
                            </Button>
                          </>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Event Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Recipients</th>
                    <th className="px-4 py-3 text-left font-semibold">Attempts</th>
                    <th className="px-4 py-3 text-left font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No notification logs yet
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 font-mono text-xs">{log.eventType}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <span className="capitalize">{log.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {log.recipients.join(', ').length > 30
                            ? log.recipients.join(', ').substring(0, 30) + '...'
                            : log.recipients.join(', ')}
                        </td>
                        <td className="px-4 py-3 text-center">{log.attemptCount}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
