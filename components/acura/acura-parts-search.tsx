'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { acuraProducts, getAcuraProductUrl, resolveAcuraImage, type AcuraProduct } from '@/lib/acura-data'
import { getPartsSearchUrl } from '@/lib/parts-search-routing'

interface AcuraPartsSearchProps {
  /**
   * Called with the committed search term (Enter or suggestion pick). Empty string clears search.
   * When omitted (e.g. on a product detail page), committing navigates to /acura?q=<query>.
   */
  onSearch?: (query: string) => void
  /** The currently committed query, controlled by the parent. */
  activeQuery?: string
  /** Visual size — "lg" for the hero search, "sm" for compact placement on detail pages. */
  size?: 'lg' | 'sm'
  /** Optional placeholder override. */
  placeholder?: string
}

/** Build a lowercase haystack for a product so we can match name, model, category and fitment. */
function haystack(product: AcuraProduct): string {
  return [product.name, product.model, product.category, product.compatibility, product.condition]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function AcuraPartsSearch({ onSearch, activeQuery = '', size = 'lg', placeholder }: AcuraPartsSearchProps) {
  const router = useRouter()
  const [input, setInput] = useState(activeQuery)
  const isCompact = size === 'sm'
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep the local input in sync when the parent clears/updates the active query.
  useEffect(() => {
    setInput(activeQuery)
  }, [activeQuery])

  // Close the suggestion dropdown when clicking outside the search box.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const trimmed = input.trim().toLowerCase()

  // Product-level suggestions scoped strictly to the Acura catalog.
  const suggestions = useMemo(() => {
    if (trimmed.length < 2) return [] as AcuraProduct[]
    const terms = trimmed.split(/\s+/)
    const matches = acuraProducts.filter((product) => {
      const hay = haystack(product)
      return terms.every((term) => hay.includes(term))
    })
    // De-duplicate by name so the dropdown stays readable.
    const seen = new Set<string>()
    const unique: AcuraProduct[] = []
    for (const product of matches) {
      const key = product.name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(product)
      if (unique.length >= 8) break
    }
    return unique
  }, [trimmed])

  // Quick model/category shortcuts so users can jump to a broad group too.
  const totalMatches = useMemo(() => {
    if (trimmed.length < 2) return 0
    const terms = trimmed.split(/\s+/)
    return acuraProducts.filter((product) => {
      const hay = haystack(product)
      return terms.every((term) => hay.includes(term))
    }).length
  }, [trimmed])

  function commit(query: string) {
    const trimmedQuery = query.trim()
    setOpen(false)
    if (onSearch) {
      onSearch(trimmedQuery)
    } else if (trimmedQuery) {
      // Shared routing rule: engine/transmission queries go to their category
      // pages; everything else stays in the Acura catalog results.
      if (/\b(engine|transmission)\b/i.test(trimmedQuery)) {
        router.push(getPartsSearchUrl({ make: 'Acura', partType: trimmedQuery }))
      } else {
        router.push(`/acura?q=${encodeURIComponent(trimmedQuery)}`)
      }
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    if (!open || suggestions.length === 0) {
      if (event.key === 'Enter') commit(input)
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((h) => (h + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const picked = suggestions[highlight]
      if (picked) {
        router.push(getAcuraProductUrl(picked))
      } else {
        commit(input)
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative mx-auto max-w-2xl">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="acura-search-suggestions"
          aria-label="Search Acura parts"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            setOpen(true)
            setHighlight(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Search Acura parts — try "TL engine" or "MDX transmission"'}
          className={`w-full rounded-full border border-border bg-card pl-12 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 ${
            isCompact ? 'h-11 pr-24 text-sm' : 'h-14 pr-28 text-base'
          }`}
        />
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput('')
              onSearch?.('')
              setOpen(false)
            }}
            aria-label="Clear search"
            className={`absolute flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
              isCompact ? 'right-[5.5rem]' : 'right-24'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => commit(input)}
          className="absolute right-2 flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div
          id="acura-search-suggestions"
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <ul className="max-h-96 overflow-y-auto py-2">
            {suggestions.map((product, index) => {
              const image = resolveAcuraImage(product)
              return (
                <li key={product.id} role="option" aria-selected={index === highlight}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => router.push(getAcuraProductUrl(product))}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      index === highlight ? 'bg-primary/10' : 'hover:bg-muted/60'
                    }`}
                  >
                    <span className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={image} alt="" fill unoptimized sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{product.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {product.model} · {product.category} · ${product.price}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() => commit(input)}
            className="flex w-full items-center justify-between border-t border-border px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted/60"
          >
            <span>
              See all {totalMatches} result{totalMatches === 1 ? '' : 's'} for &ldquo;{input.trim()}&rdquo;
            </span>
            <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* No matches hint */}
      {open && trimmed.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground shadow-xl">
          No Acura parts match &ldquo;{input.trim()}&rdquo;. Try a model name or part type.
        </div>
      )}
    </div>
  )
}
