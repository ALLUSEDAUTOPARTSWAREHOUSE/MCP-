'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { CAR_MAKES, CAR_MODELS, PART_CATEGORIES, YEARS } from '@/lib/data'
import type { PartCategory } from '@/lib/data'
import { getPartsSearchUrl } from '@/lib/parts-search-routing'

interface AppleStylePartsSearchProps {
  /** Callback when search is submitted */
  onSearch?: (filters: SearchFilters) => void
  /** Optional title override */
  title?: string
  /** Optional subtitle */
  subtitle?: string
  /** Hide the Make field (for single-brand pages) */
  hideMake?: boolean
  /** Hide the Model field */
  hideModel?: boolean
  /** Predefined make value */
  defaultMake?: string
}

export interface SearchFilters {
  make?: string
  model?: string
  year?: string
  partType?: string
}

export function AppleStylePartsSearch({
  onSearch,
  title = 'Find Your Parts',
  subtitle = 'Search our 2,000+ yard network',
  hideMake = false,
  hideModel = false,
  defaultMake,
}: AppleStylePartsSearchProps) {
  const router = useRouter()
  const [selectedMake, setSelectedMake] = useState(defaultMake || '')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedPart, setSelectedPart] = useState('')

  // Get available models for selected make
  const availableModels = useMemo(() => {
    if (!selectedMake) return []
    const models = CAR_MODELS[selectedMake] || []
    return models.sort()
  }, [selectedMake])

  // Get available years for selected make/model
  const availableYears = useMemo(() => {
    if (!selectedMake) return []
    return YEARS
  }, [selectedMake])

  // Get available part types - only Engine and Transmission
  const partTypes = useMemo(() => {
    return ['Engine', 'Transmission']
  }, [])

  function handleSearch() {
    if (!selectedMake) {
      alert('Please select a make')
      return
    }
    const filters = {
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
      partType: selectedPart,
    }

    if (onSearch) {
      onSearch(filters)
      return
    }

    router.push(getPartsSearchUrl(filters))
  }

  const gridCols = hideMake ? (hideModel ? 2 : 3) : hideModel ? 3 : 4

  return (
    <div className="w-full bg-gradient-to-b from-card/30 to-background py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2 text-balance">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
        </div>

        {/* Search Form - Apple Style Grid */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-10">
          <div className={`grid gap-4 md:gap-6 mb-8 ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
            {/* Make */}
            {!hideMake && (
              <div>
                <label className="text-xs sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  Make *
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value)
                    setSelectedModel('')
                  }}
                  className="w-full px-4 py-3.5 sm:py-4 bg-background border border-border/60 rounded-xl text-foreground font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="">Select Make</option>
                  {CAR_MAKES.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Model */}
            {!hideModel && (
              <div>
                <label className="text-xs sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full px-4 py-3.5 sm:py-4 bg-background border border-border/60 rounded-xl text-foreground font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="">{selectedMake ? 'Select Model' : 'Select Make First'}</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Year */}
            <div>
              <label className="text-xs sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={!selectedMake}
                className="w-full px-4 py-3.5 sm:py-4 bg-background border border-border/60 rounded-xl text-foreground font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">{selectedMake ? 'Select Year' : 'Select Make First'}</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Part Type */}
            <div>
              <label className="text-xs sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                Part Type
              </label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="w-full px-4 py-3.5 sm:py-4 bg-background border border-border/60 rounded-xl text-foreground font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">Select Part Type</option>
                {partTypes.map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleSearch}
              className="flex-1 px-6 py-3.5 sm:py-4 bg-primary text-primary-foreground font-bold text-base rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5" />
              Search Parts
            </button>
            <a
              href="/quote"
              className="flex-1 px-6 py-3.5 sm:py-4 bg-secondary text-secondary-foreground font-bold text-base rounded-xl hover:bg-secondary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Request a Free Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
