'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { acuraProducts } from '@/lib/acura-data'
import { getPartsSearchUrl } from '@/lib/parts-search-routing'

interface AppleSearchProps {
  onSearch?: (query: string) => void
  activeQuery?: string
}

const selectClasses =
  'w-full rounded-lg border border-border/50 bg-card px-4 py-3 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50'

/**
 * Guided finder for the Acura catalog. Every part here is Acura, so the
 * cascade is Model -> Year -> Part Type (no redundant "Make" step).
 */
export function AppleStyleSearch({ onSearch }: AppleSearchProps) {
  const router = useRouter()
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [partType, setPartType] = useState('')

  // Unique Acura models from the pricing sheet.
  const models = useMemo(() => {
    const set = new Set(acuraProducts.map((p) => p.model).filter(Boolean))
    return Array.from(set).sort()
  }, [])

  // Years narrowed by the selected model so impossible combos never show.
  const years = useMemo(() => {
    const source = model ? acuraProducts.filter((p) => p.model === model) : acuraProducts
    const set = new Set(source.map((p) => p.year).filter(Boolean))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [model])

  // Part types narrowed by model + year.
  const partTypes = useMemo(() => {
    const source = acuraProducts.filter(
      (p) => (!model || p.model === model) && (!year || String(p.year) === year),
    )
    const set = new Set(source.map((p) => p.category).filter(Boolean))
    return Array.from(set).sort()
  }, [model, year])

  const canSearch = Boolean(model || year || partType)

  function handleSearch() {
    if (!canSearch) return

    if (partType) {
      router.push(getPartsSearchUrl({ make: 'Acura', model, year, partType }))
      return
    }

    const query = [year, model].filter(Boolean).join(' ')
    if (query.trim() && onSearch) onSearch(query)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Model / Year / Part Needed */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="acura-finder-model"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Model *
              </label>
              <select
                id="acura-finder-model"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  setYear('')
                  setPartType('')
                }}
                className={selectClasses}
              >
                <option value="">Select Model</option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="acura-finder-year"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Year
              </label>
              <select
                id="acura-finder-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onKeyDown={handleKeyDown}
                className={selectClasses}
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="acura-finder-part"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Part Needed
              </label>
              <select
                id="acura-finder-part"
                value={partType}
                onChange={(e) => setPartType(e.target.value)}
                onKeyDown={handleKeyDown}
                className={selectClasses}
              >
                <option value="">All Part Types</option>
                {partTypes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSearch}
              disabled={!canSearch}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity disabled:opacity-50 hover:opacity-90"
            >
              Search Parts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
