'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Mail, CheckCircle, AlertCircle, Clock, Trash2, RefreshCw } from 'lucide-react'

interface NotificationSetting {
  id: string
  eventType: string
  enabled: boolean
  recipients: string[]
  subject: string
  description: string
}

interface NotificationLog {
  id: string
  eventType: string
  recipients: string[]
  subject: string
  status: 'pending' | 'sent' | 'failed'
  failureReason?: string
  createdAt: string
  updatedAt: string
}

export function NotificationDashboard() {
  const [settings, setSettings] = useState<NotificationSetting[]>([])
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('settings')

  // Fetch settings and logs
  useEffect(() => {
    fetchSettings()
    fetchLogs()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/notifications/settings')
      const data = await res.json()
      setSettings(data.settings || [])
    } catch (error) {
      console.error('[Dashboard] Failed to fetch settings:', error)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/notifications/logs?limit=50')
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('[Dashboard] Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update notification setting
  const handleToggleSetting = async (setting: NotificationSetting) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setting,
          enabled: !setting.enabled,
        }),
      })

      if (res.ok) {
        await fetchSettings()
      }
    } catch (error) {
      console.error('[Dashboard] Failed to toggle setting:', error)
    } finally {
      setSaving(false)
    }
  }

  // Update recipients
  const handleUpdateRecipients = async (setting: NotificationSetting, newRecipients: string) => {
    setSaving(true)
    try {
      const recipients = newRecipients.split(',').map((r) => r.trim())

      const res = await fetch('/api/admin/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setting,
          recipients,
        }),
      })

      if (res.ok) {
        await fetchSettings()
      }
    } catch (error) {
      console.error('[Dashboard] Failed to update recipients:', error)
    } finally {
      setSaving(false)
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📧 Notification Management</h2>
          <p className="text-muted-foreground mt-1">Configure notification events and monitor delivery logs</p>
        </div>
        <Button onClick={() => { fetchSettings(); fetchLogs() }} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4">
            {settings.map((setting) => (
              <Card key={setting.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        {setting.eventType}
                      </CardTitle>
                      <CardDescription className="mt-1">{setting.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{setting.enabled ? 'Enabled' : 'Disabled'}</span>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => handleToggleSetting(setting)}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject Line</label>
                    <Input value={setting.subject} disabled className="bg-muted" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipients (comma-separated)</label>
                    <div className="space-y-2">
                      <Input
                        placeholder="email1@example.com, email2@example.com"
                        defaultValue={
                          Array.isArray(setting.recipients) ? setting.recipients.join(', ') : setting.recipients
                        }
                        onBlur={(e) => handleUpdateRecipients(setting, e.target.value)}
                        disabled={saving}
                      />
                      <p className="text-xs text-muted-foreground">
                        Default: auapworld@gmail.com, sale@auapw.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs">
                    {Array.isArray(setting.recipients) &&
                      setting.recipients.map((email) => (
                        <Badge key={email} variant="secondary">
                          <Mail className="w-3 h-3 mr-1" />
                          {email}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logs</CardTitle>
              <CardDescription>Recent notification send attempts and status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No logs found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <div>
                            <p className="font-medium text-sm">{log.eventType}</p>
                            <p className="text-xs text-muted-foreground">{log.subject}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            log.status === 'sent'
                              ? 'default'
                              : log.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>

                      <div className="text-xs space-y-1 text-muted-foreground mt-3">
                        <p>
                          <strong>Recipients:</strong> {Array.isArray(log.recipients) ? log.recipients.join(', ') : log.recipients}
                        </p>
                        <p>
                          <strong>Sent:</strong> {new Date(log.createdAt).toLocaleString()}
                        </p>
                        {log.failureReason && (
                          <p className="text-red-600">
                            <strong>Reason:</strong> {log.failureReason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
