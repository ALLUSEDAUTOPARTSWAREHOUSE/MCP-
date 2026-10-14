'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react'

interface ContentPage {
  id: string
  slug: string
  title: string
  status: string
  contentType: string
  category?: string
  updatedAt: string
}

export default function PagesManager() {
  const router = useRouter()
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  useEffect(() => {
    fetchPages()
  }, [filterStatus])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)

      const res = await fetch(`/api/admin/cms/pages?${params}`, { credentials: 'include' })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch pages')

      const data = await res.json()
      setPages(data.pages || [])
    } catch (err) {
      setError('Failed to load pages')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this page?')) return

    try {
      const res = await fetch(`/api/admin/cms/pages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to delete page')

      setPages(pages.filter((p) => p.id !== id))
    } catch (err) {
      alert('Failed to delete page')
      console.error(err)
    }
  }

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/cms"
                className="p-2 hover:bg-slate-700 rounded transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </Link>
              <h1 className="text-3xl font-bold text-white">Content Pages</h1>
            </div>
            <Link
              href="/admin/cms/pages/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              New Page
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Pages Table */}
        {loading ? (
          <div className="text-center text-slate-300">Loading pages...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-12 text-slate-300">
            <p className="mb-4">No pages found</p>
            <Link
              href="/admin/cms/pages/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create First Page
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-700 rounded-lg">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 text-white font-medium">{page.title}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{page.slug}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{page.contentType}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          page.status === 'published'
                            ? 'bg-green-900 text-green-200'
                            : page.status === 'draft'
                              ? 'bg-yellow-900 text-yellow-200'
                              : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/admin/cms/pages/edit/${page.id}`}
                        className="p-2 hover:bg-slate-700 rounded transition"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 hover:bg-slate-700 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
