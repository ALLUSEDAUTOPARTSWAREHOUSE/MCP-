'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, BarChart3, HelpCircle, LogOut, Plus } from 'lucide-react'

export default function CMSDashboard() {
  const router = useRouter()
  const [portalType, setPortalType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const res = await fetch('/api/admin/auth/session', { credentials: 'include' })
      if (!res.ok) {
        router.push('/admin/login')
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">CMS Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admin Portal Card */}
          <Link href="/admin/cms/pages">
            <div className="h-full p-6 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Content Manager</h2>
              </div>
              <p className="text-slate-300 mb-6">Manage all website pages, blog posts, and general content</p>
              <div className="flex items-center text-blue-400">
                <Plus className="w-4 h-4 mr-2" />
                Manage Pages
              </div>
            </div>
          </Link>

          {/* Sales Team Portal Card */}
          <Link href="/admin/cms/sales">
            <div className="h-full p-6 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Sales Team</h2>
              </div>
              <p className="text-slate-300 mb-6">Manage product features, promotions, and sales content</p>
              <div className="flex items-center text-green-400">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </div>
            </div>
          </Link>

          {/* Support Team Portal Card */}
          <Link href="/admin/cms/support">
            <div className="h-full p-6 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-8 h-8 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Support Team</h2>
              </div>
              <p className="text-slate-300 mb-6">Manage FAQs, policies, and customer support content</p>
              <div className="flex items-center text-orange-400">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 p-6 rounded-lg border border-slate-700 bg-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">Portal Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700 rounded text-center">
              <div className="text-2xl font-bold text-blue-400">0</div>
              <div className="text-sm text-slate-300">Total Pages</div>
            </div>
            <div className="p-4 bg-slate-700 rounded text-center">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-sm text-slate-300">Active Campaigns</div>
            </div>
            <div className="p-4 bg-slate-700 rounded text-center">
              <div className="text-2xl font-bold text-orange-400">0</div>
              <div className="text-sm text-slate-300">Help Articles</div>
            </div>
            <div className="p-4 bg-slate-700 rounded text-center">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-sm text-slate-300">Recent Changes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
