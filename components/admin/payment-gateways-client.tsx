'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Wallet,
  Landmark,
  Link2,
  Phone,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Star,
  Pencil,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type GatewayType = 'card' | 'wallet' | 'bank' | 'link' | 'offline'

interface Gateway {
  id: string
  name: string
  slug: string
  type: GatewayType
  description: string | null
  logo: string | null
  isEnabled: boolean
  isDefault: boolean
  sortOrder: number
  config: Record<string, unknown> | null
  paymentLink: string | null
  instructions: string | null
  envVarsRequired: string[] | null
}

const TYPE_ICON: Record<GatewayType, typeof CreditCard> = {
  card: CreditCard,
  wallet: Wallet,
  bank: Landmark,
  link: Link2,
  offline: Phone,
}

const TYPE_LABEL: Record<GatewayType, string> = {
  card: 'Card Gateway',
  wallet: 'Digital Wallet',
  bank: 'Bank / Wire Transfer',
  link: 'Payment Link / EPS',
  offline: 'Offline / Manual',
}

const EXAMPLES: Record<GatewayType, string> = {
  card: 'e.g. Authorize.Net, Stripe, Square',
  wallet: 'e.g. PayPal, Google Pay, Apple Pay, Venmo',
  bank: 'e.g. Wire Transfer, ACH, Zelle',
  link: 'e.g. Stripe Payment Link, PayPal.me, EPS hosted checkout',
  offline: 'e.g. Pay by Phone, Cash on Pickup',
}

// Suggested env var names per method type, used as quick-add chips. These are
// names only — admins add the actual values in Vercel Project Settings, never
// in this dashboard.
const SUGGESTED_ENV_VARS: Record<GatewayType, string[]> = {
  card: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'AUTHORIZE_NET_API_LOGIN_ID', 'AUTHORIZE_NET_TRANSACTION_KEY'],
  wallet: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET', 'GOOGLE_PAY_MERCHANT_ID', 'APPLE_PAY_MERCHANT_ID'],
  bank: [],
  link: ['STRIPE_PAYMENT_LINK_URL'],
  offline: [],
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  type: 'card' as GatewayType,
  description: '',
  isEnabled: true,
  paymentLink: '',
  instructions: '',
  envVarsRequired: [] as string[],
}

export function PaymentGatewaysClient() {
  const router = useRouter()
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [envVarInput, setEnvVarInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadGateways = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/payment-gateways', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      const list: Gateway[] = data.gateways ?? []
      setGateways(list)

      const allVars = Array.from(new Set(list.flatMap((g) => g.envVarsRequired ?? [])))
      if (allVars.length > 0) {
        const statusRes = await fetch(`/api/payment-gateways/env-status?vars=${encodeURIComponent(allVars.join(','))}`, {
          credentials: 'include',
        })
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          setEnvStatus(statusData.status ?? {})
        }
      } else {
        setEnvStatus({})
      }
    } catch {
      setError('Failed to load payment gateways.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGateways()
  }, [])

  const toggleEnabled = async (gateway: Gateway) => {
    await fetch(`/api/payment-gateways/${gateway.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isEnabled: !gateway.isEnabled }),
    })
    await loadGateways()
  }

  const makeDefault = async (gateway: Gateway) => {
    await fetch(`/api/payment-gateways/${gateway.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isDefault: true }),
    })
    await loadGateways()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this payment gateway?')) return
    await fetch(`/api/payment-gateways/${id}`, { method: 'DELETE', credentials: 'include' })
    await loadGateways()
  }

  const openAddDialog = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setEnvVarInput('')
    setError(null)
    setDialogOpen(true)
  }

  const openEditDialog = (gateway: Gateway) => {
    setEditingId(gateway.id)
    setForm({
      name: gateway.name,
      slug: gateway.slug,
      type: gateway.type,
      description: gateway.description ?? '',
      isEnabled: gateway.isEnabled,
      paymentLink: gateway.paymentLink ?? '',
      instructions: gateway.instructions ?? '',
      envVarsRequired: gateway.envVarsRequired ?? [],
    })
    setEnvVarInput('')
    setError(null)
    setDialogOpen(true)
  }

  const addEnvVar = (name: string) => {
    const trimmed = name.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_')
    if (!trimmed || form.envVarsRequired.includes(trimmed)) return
    setForm((f) => ({ ...f, envVarsRequired: [...f.envVarsRequired, trimmed] }))
    setEnvVarInput('')
  }

  const removeEnvVar = (name: string) => {
    setForm((f) => ({ ...f, envVarsRequired: f.envVarsRequired.filter((v) => v !== name) }))
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      setError('Name and slug are required.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(
        editingId ? `/api/payment-gateways/${editingId}` : '/api/payment-gateways',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to save payment gateway.')
        return
      }
      setDialogOpen(false)
      setForm(EMPTY_FORM)
      setEditingId(null)
      await loadGateways()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const needsPaymentLink = form.type === 'link'
  const needsInstructions = form.type === 'bank' || form.type === 'offline' || form.type === 'link'
  const suggestions = useMemo(
    () => SUGGESTED_ENV_VARS[form.type].filter((v) => !form.envVarsRequired.includes(v)),
    [form.type, form.envVarsRequired]
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Payment Methods &amp; Gateways
          </h1>
          <p className="text-sm text-muted-foreground">
            Enable the gateways customers see at checkout, choose a default provider, and
            connect each one to its API keys, a hosted payment link, or wire/EPS instructions
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Gateway
        </Button>
      </div>

      {error && !dialogOpen && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading payment gateways…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gateways.map((gateway) => {
            const Icon = TYPE_ICON[gateway.type] ?? CreditCard
            const requiredVars = gateway.envVarsRequired ?? []
            const missingVars = requiredVars.filter((v) => !envStatus[v])
            const hasPaymentLink = Boolean(gateway.paymentLink)
            const isConfigured = requiredVars.length > 0 ? missingVars.length === 0 : hasPaymentLink || gateway.type === 'offline' || gateway.type === 'bank'

            return (
              <div
                key={gateway.id}
                className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{gateway.name}</p>
                        {gateway.isDefault && (
                          <Badge className="gap-1">
                            <Star className="w-3 h-3" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {TYPE_LABEL[gateway.type] ?? gateway.type}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={gateway.isEnabled}
                    onCheckedChange={() => toggleEnabled(gateway)}
                    aria-label={`Toggle ${gateway.name}`}
                  />
                </div>

                {gateway.description && (
                  <p className="text-sm text-muted-foreground">{gateway.description}</p>
                )}

                {requiredVars.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {requiredVars.map((v) => (
                      <span
                        key={v}
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono ${
                          envStatus[v]
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {envStatus[v] ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {isConfigured ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {hasPaymentLink ? 'Payment link configured' : 'Ready to accept payments'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-500">
                    <KeyRound className="w-3.5 h-3.5" />
                    {requiredVars.length > 0
                      ? `Add ${missingVars.join(', ')} in Project Settings`
                      : 'No payment link set yet'}
                  </span>
                )}

                <div className="flex gap-2 mt-auto pt-2">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEditDialog(gateway)}>
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  {!gateway.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5"
                      onClick={() => makeDefault(gateway)}
                      disabled={!gateway.isEnabled}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Make Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(gateway.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Payment Gateway' : 'Add Payment Gateway'}</DialogTitle>
            <DialogDescription>
              Configure how this method appears at checkout. Any type of payment method works
              here — card processors, digital wallets (PayPal, Google Pay, Apple Pay), bank or
              wire transfer, hosted payment links (EPS, Stripe Payment Links), or offline/manual.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="space-y-1.5">
              <Label htmlFor="gw-name">Display name</Label>
              <Input
                id="gw-name"
                placeholder="e.g. Google Pay, Wire Transfer, EPS"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gw-slug">Slug</Label>
              <Input
                id="gw-slug"
                placeholder="e.g. google_pay"
                value={form.slug}
                disabled={Boolean(editingId)}
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gw-type">Method type</Label>
              <Select
                value={form.type}
                onValueChange={(value: GatewayType) => setForm({ ...form, type: value })}
              >
                <SelectTrigger id="gw-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABEL) as GatewayType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{EXAMPLES[form.type]}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gw-description">Customer-facing description</Label>
              <Textarea
                id="gw-description"
                placeholder="Shown to shoppers at checkout (optional)"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Required API keys (env var names)
              </p>
              <p className="text-xs text-muted-foreground">
                List the Vercel environment variable names this gateway's live API key/secret
                should be read from. Add the actual values in Project Settings → Environment
                Variables — never here.
              </p>
              {form.envVarsRequired.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.envVarsRequired.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs font-mono"
                    >
                      {v}
                      <button
                        type="button"
                        onClick={() => removeEnvVar(v)}
                        aria-label={`Remove ${v}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. STRIPE_SECRET_KEY"
                  value={envVarInput}
                  onChange={(e) => setEnvVarInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      addEnvVar(envVarInput)
                    }
                  }}
                  className="font-mono text-xs"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addEnvVar(envVarInput)}>
                  Add
                </Button>
              </div>
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => addEnvVar(v)}
                      className="rounded border border-dashed border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      + {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {needsPaymentLink && (
              <div className="space-y-1.5">
                <Label htmlFor="gw-link">Hosted payment link URL</Label>
                <Input
                  id="gw-link"
                  placeholder="e.g. https://pay.example.com/your-store, EPS checkout, or a PayPal.me link"
                  value={form.paymentLink}
                  onChange={(e) => setForm({ ...form, paymentLink: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Customers are sent to this link to complete payment.
                </p>
              </div>
            )}

            {needsInstructions && (
              <div className="space-y-1.5">
                <Label htmlFor="gw-instructions">Customer instructions</Label>
                <Textarea
                  id="gw-instructions"
                  placeholder="e.g. wire/bank transfer details, or what happens after checkout"
                  rows={3}
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Gateway'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
