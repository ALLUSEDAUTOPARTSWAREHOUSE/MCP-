'use client'

import { useState, useEffect } from 'react'
import { Zap, X, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Comparison {
  id: string
  name: string
  description: string
  productIds: string[]
  productCount: number
  createdAt: string
}

export default function ComparisonsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newComparison, setNewComparison] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchComparisons()
  }, [])

  const fetchComparisons = async () => {
    try {
      const res = await fetch('/api/comparisons')
      if (res.ok) {
        const data = await res.json()
        setComparisons(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching comparisons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveComparison = async () => {
    if (!newComparison.name.trim()) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComparison),
      })
      if (res.ok) {
        const data = await res.json()
        setComparisons([...comparisons, data])
        setNewComparison({ name: '', description: '' })
      }
    } catch (error) {
      console.error('[v0] Error saving comparison:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/comparisons/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setComparisons(comparisons.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error('[v0] Error deleting comparison:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading comparisons...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Comparisons</h1>
        <p className="text-foreground/60">Save and compare your favorite parts</p>
      </div>

      {/* Create New Comparison */}
      <div className="p-6 border border-blue-500/30 rounded-lg bg-blue-500/5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Save Current Comparison</h2>
        <div className="space-y-3">
          <Input
            placeholder="Comparison name (e.g. 'Engine Options for my Civic')"
            value={newComparison.name}
            onChange={(e) => setNewComparison({ ...newComparison, name: e.target.value })}
          />
          <Input
            placeholder="Description (optional)"
            value={newComparison.description}
            onChange={(e) => setNewComparison({ ...newComparison, description: e.target.value })}
          />
          <Button
            size="lg"
            className="w-full"
            onClick={handleSaveComparison}
            disabled={isSaving || !newComparison.name.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Comparison'}
          </Button>
        </div>
      </div>

      {/* Saved Comparisons */}
      {comparisons.length === 0 ? (
        <div className="text-center py-20">
          <Zap className="w-16 h-16 mx-auto text-foreground/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Saved Comparisons</h2>
          <p className="text-foreground/60 mb-6">
            Comparing parts? Save your comparison to revisit it later
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {comparisons.map((comparison) => (
            <div
              key={comparison.id}
              className="p-6 border border-white/10 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{comparison.name}</h3>
                  {comparison.description && (
                    <p className="text-sm text-foreground/60 mb-2">{comparison.description}</p>
                  )}
                  <p className="text-xs text-foreground/60">
                    {comparison.productCount} product{comparison.productCount !== 1 ? 's' : ''} •{' '}
                    {new Date(comparison.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(comparison.id)}
                  className="p-2 text-foreground/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
