'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Search, HelpCircle } from 'lucide-react'

interface SupportContent {
  id: string
  title: string
  contentType: string
  category: string
  status: string
  priority: number
  updatedAt: string
}

export default function SupportPortal() {
  const router = useRouter()
  const [content, setContent] = useState<SupportContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchContent()
  }, [categoryFilter])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (categoryFilter) params.append('category', categoryFilter)

      const res = await fetch(`/api/admin/cms/support?${params}`, { credentials: 'include' })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch support content')

      const data = await res.json()
      setContent(data.content || [])
    } catch (err) {
      setError('Failed to load support content')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = content.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = ['shipping', 'returns', 'payments', 'account', 'technical']

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
                <HelpCircle className="w-8 h-8 text-orange-400" />
                <h1 className="text-3xl font-bold text-white">Support Team Portal</h1>
              </div>
            </div>
            <Link
              href="/admin/cms/support/new"
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">0</div>
            <div className="text-sm text-slate-300">Total Articles</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">0</div>
            <div className="text-sm text-slate-300">FAQs</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-sm text-slate-300">Policies</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-sm text-slate-300">Guides</div>
          </div>
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-pink-400">0</div>
            <div className="text-sm text-slate-300">Troubleshooting</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center text-slate-300">Loading articles...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12 text-slate-300">
            <p className="mb-4">No support articles yet</p>
            <Link
              href="/admin/cms/support/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create First Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-slate-700 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white flex-1">{item.title}</h3>
                  <span className="ml-2 text-xs px-2 py-1 bg-slate-700 text-slate-200 rounded">
                    {item.priority > 0 ? '⭐ ' + item.priority : 'Normal'}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-300">
                  <p>Type: {item.contentType}</p>
                  <p>Category: {item.category}</p>
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
                    href={`/admin/cms/support/edit/${item.id}`}
                    className="p-2 hover:bg-slate-600 rounded transition flex-1 text-center"
                  >
                    <Edit className="w-4 h-4 text-blue-400 inline" />
                  </Link>
                  <button className="p-2 hover:bg-slate-600 rounded transition flex-1 text-center">
                    <Trash2 className="w-4 h-4 text-red-400 inline" />
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
