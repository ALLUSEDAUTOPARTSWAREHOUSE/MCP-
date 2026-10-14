'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import { AlertTriangle, TrendingUp, Users, DollarSign, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'

interface FraudFlag {
  id: string
  type: string
  severity: string
  status: string
  userId?: string
  sellerId?: string
  createdAt: Date
}

interface LedgerEntry {
  id: string
  type: string
  amount: string
  sellerId: string
  createdAt: Date
}

export function AdminMarketplaceDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    fraudFlags: 0,
    criticalFlags: 0,
    totalLedgerTransactions: 0,
    platformRevenue: '0',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // In a real app, fetch from API endpoints
        // For now, we'll show the structure
        setStats({
          fraudFlags: 0,
          criticalFlags: 0,
          totalLedgerTransactions: 0,
          platformRevenue: '0',
        })
      } catch (error) {
        console.error('[v0] Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
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
          <h1 className="text-4xl font-bold mb-2">Marketplace Admin</h1>
          <p className="text-muted-foreground">Monitor marketplace health and manage fraud/payouts</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Fraud Flags</p>
            <Shield className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">{stats.fraudFlags}</p>
          <p className={`text-xs mt-2 ${stats.criticalFlags > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.criticalFlags} critical
          </p>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Ledger Entries</p>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{stats.totalLedgerTransactions}</p>
          <p className="text-xs text-muted-foreground mt-2">Total transactions</p>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Platform Revenue</p>
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold">${parseFloat(stats.platformRevenue || '0').toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-2">From 5% commissions</p>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Marketplace</p>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">Live</p>
          <p className="text-xs text-green-600 mt-2">Operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Management */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold">Fraud Management</h2>
          </div>

          <div className="space-y-4">
            <Link
              href="/admin/marketplace/fraud/flags"
              className="block p-4 rounded-lg border border-border hover:border-primary transition"
            >
              <p className="font-semibold mb-1">Active Fraud Flags</p>
              <p className="text-sm text-muted-foreground">Review and investigate suspicious activities</p>
            </Link>

            <Link
              href="/admin/marketplace/fraud/chargebacks"
              className="block p-4 rounded-lg border border-border hover:border-primary transition"
            >
              <p className="font-semibold mb-1">Chargebacks & Disputes</p>
              <p className="text-sm text-muted-foreground">Monitor payment disputes</p>
            </Link>

            <Link
              href="/admin/marketplace/fraud/settings"
              className="block p-4 rounded-lg border border-border hover:border-primary transition"
            >
              <p className="font-semibold mb-1">Fraud Rules</p>
              <p className="text-sm text-muted-foreground">Configure fraud detection thresholds</p>
            </Link>
          </div>
        </div>

        {/* Financial Management */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold">Financial Management</h2>
          </div>

          <div className="space-y-4">
            <Link
              href="/admin/marketplace/ledger"
              className="block p-4 rounded-lg border border-border hover:border-primary transition"
            >
              <p className="font-semibold mb-1">Ledger Entries</p>
              <p className="text-sm text-muted-foreground">View all sales, commissions, and adjustments</p>
            </Link>

            <Link
              href="/admin/marketplace/payouts"
              className="block p-4 rounded-lg border border-border hover:border-primary transition"
            >
              <p className="font-semibold mb-1">Seller Payouts</p>
              <p className="text-sm text-muted-foreground">Manage pending and completed payouts</p>
            </Link>

            <Link
              href="/admin/marketplace/reconciliation"
              className="block p-4 rounded-lg border border-border hover:border-primary transition"
            >
              <p className="font-semibold mb-1">Reconciliation</p>
              <p className="text-sm text-muted-foreground">Verify financial balances and reports</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Seller Management */}
      <div className="mt-6 border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Seller Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/marketplace/sellers"
            className="p-4 rounded-lg border border-border hover:border-primary transition text-center"
          >
            <p className="font-semibold">All Sellers</p>
            <p className="text-sm text-muted-foreground">View seller profiles and stats</p>
          </Link>

          <Link
            href="/admin/marketplace/sellers/verification"
            className="p-4 rounded-lg border border-border hover:border-primary transition text-center"
          >
            <p className="font-semibold">Verification Queue</p>
            <p className="text-sm text-muted-foreground">Approve/reject seller applications</p>
          </Link>

          <Link
            href="/admin/marketplace/sellers/suspended"
            className="p-4 rounded-lg border border-border hover:border-primary transition text-center"
          >
            <p className="font-semibold">Suspended Sellers</p>
            <p className="text-sm text-muted-foreground">Manage account suspensions</p>
          </Link>
        </div>
      </div>

      {/* Reports */}
      <div className="mt-6 border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-6">Reports & Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/marketplace/reports/daily"
            className="p-4 rounded-lg border border-border hover:border-primary transition"
          >
            <p className="text-sm font-semibold">Daily Summary</p>
          </Link>
          <Link
            href="/admin/marketplace/reports/monthly"
            className="p-4 rounded-lg border border-border hover:border-primary transition"
          >
            <p className="text-sm font-semibold">Monthly Report</p>
          </Link>
          <Link
            href="/admin/marketplace/reports/sellers"
            className="p-4 rounded-lg border border-border hover:border-primary transition"
          >
            <p className="text-sm font-semibold">Seller Report</p>
          </Link>
          <Link
            href="/admin/marketplace/reports/export"
            className="p-4 rounded-lg border border-border hover:border-primary transition"
          >
            <p className="text-sm font-semibold">Export Data</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
