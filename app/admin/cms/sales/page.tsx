'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Search, BarChart3 } from 'lucide-react'

interface SalesContent {
  id: string
  title: string
  contentType: string
  targetAudience?: string
  status: string
  startDate?: string
  endDate?: string
  updatedAt: string
}

export default function SalesPortal() {
  const router = useRouter()
  const [content, setContent] = useState<SalesContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/cms/sales`, { credentials: 'include' })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch sales content')

      const data = await res.json()
      setContent(data.content || [])
    } catch (err) {
      setError('Failed to load sales content')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = content.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin/cms" className="p-2 hover:bg-slate-700 rounded transition">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </Link>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-green-400" />
                <h1 className="text-3xl font-bold text-white">Sales Team Portal</h1>
              </div>
            </div>
            <Link
              href="/admin/cms/sales/new"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-sm text-slate-300">Active Campaigns</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">0</div>
            <div className="text-sm text-slate-300">Draft Campaigns</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-sm text-slate-300">Products Featured</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">0</div>
            <div className="text-sm text-slate-300">Audience Segments</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center text-slate-300">Loading campaigns...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12 text-slate-300">
            <p className="mb-4">No campaigns yet</p>
            <Link
              href="/admin/cms/sales/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create First Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div key={item.id} className="p-4 border border-slate-700 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <div className="space-y-2 mb-4 text-sm text-slate-300">
                  <p>Type: {item.contentType}</p>
                  <p>Audience: {item.targetAudience || 'All'}</p>
                  <p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === 'published'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-yellow-900 text-yellow-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/cms/sales/edit/${item.id}`}
                    className="p-2 hover:bg-slate-600 rounded transition flex-1"
                  >
                    <Edit className="w-4 h-4 text-blue-400" />
                  </Link>
                  <button className="p-2 hover:bg-slate-600 rounded transition flex-1">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
