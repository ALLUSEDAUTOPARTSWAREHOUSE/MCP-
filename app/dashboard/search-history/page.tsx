'use client'

import { useState, useEffect } from 'react'
import { Search, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchItem {
  id: string
  query: string
  category: string
  resultsCount: number
  createdAt: string
}

export default function SearchHistoryPage() {
  const [searches, setSearches] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSearchHistory()
  }, [])

  const fetchSearchHistory = async () => {
    try {
      const res = await fetch('/api/search-history')
      if (res.ok) {
        const data = await res.json()
        setSearches(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching search history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/search-history/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSearches(searches.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error('[v0] Error deleting search:', error)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Clear all search history?')) return
    try {
      const res = await fetch('/api/search-history', { method: 'DELETE' })
      if (res.ok) {
        setSearches([])
      }
    } catch (error) {
      console.error('[v0] Error clearing search history:', error)
    }
  }

  const handleSearch = (query: string) => {
    window.location.href = `/parts?search=${encodeURIComponent(query)}`
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading search history...</div>
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="w-16 h-16 mx-auto text-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Search History</h2>
        <p className="text-foreground/60">Your searches will appear here</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search History</h1>
          <p className="text-foreground/60">View your recent searches</p>
        </div>
        <Button variant="outline" onClick={handleClearAll} className="text-red-400 hover:text-red-300">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Search Groups by Time Period */}
      <div className="space-y-6">
        {/* Today */}
        {searches.some((s) => {
          const date = new Date(s.createdAt)
          const today = new Date()
          return date.toDateString() === today.toDateString()
        }) && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 uppercase mb-3">Today</h3>
            <div className="space-y-2">
              {searches
                .filter((s) => {
                  const date = new Date(s.createdAt)
                  const today = new Date()
                  return date.toDateString() === today.toDateString()
                })
                .map((search) => (
                  <SearchHistoryItem
                    key={search.id}
                    search={search}
                    onSearch={handleSearch}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Earlier */}
        {searches.some((s) => {
          const date = new Date(s.createdAt)
          const today = new Date()
          return date.toDateString() !== today.toDateString()
        }) && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 uppercase mb-3">Earlier</h3>
            <div className="space-y-2">
              {searches
                .filter((s) => {
                  const date = new Date(s.createdAt)
                  const today = new Date()
                  return date.toDateString() !== today.toDateString()
                })
                .map((search) => (
                  <SearchHistoryItem
                    key={search.id}
                    search={search}
                    onSearch={handleSearch}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SearchHistoryItem({
  search,
  onSearch,
  onDelete,
}: {
  search: SearchItem
  onSearch: (query: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors flex items-center justify-between group">
      <button
        onClick={() => onSearch(search.query)}
        className="flex-1 text-left hover:text-blue-400 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-foreground/60" />
          <div>
            <p className="font-semibold">{search.query}</p>
            <p className="text-xs text-foreground/60">
              {search.category && `${search.category} • `}
              {search.resultsCount} result{search.resultsCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </button>
      <button
        onClick={() => onDelete(search.id)}
        className="p-2 text-foreground/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
