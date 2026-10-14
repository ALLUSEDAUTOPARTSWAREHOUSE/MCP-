"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Search, Loader2, ArrowRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CatalogHit } from "@/lib/ai-catalog"

interface SmartSearchResponse {
  filters: {
    query: string
    model: string | null
    year: string | null
    category: string | null
    maxPrice: number | null
    intent: string
  }
  results: CatalogHit[]
}

const EXAMPLES = [
  "Cheap engine for a 2003 Acura CL",
  "Automatic transmission for an MDX under $2000",
  "Low mileage TL motor",
  "Best RDX engine you have",
]

export function SmartSearch() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SmartSearchResponse | null>(null)
  const [searched, setSearched] = useState(false)

  async function runSearch(q: string) {
    const value = q.trim()
    if (!value || loading) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const res = await fetch("/api/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      })
      if (!res.ok) throw new Error("Search failed")
      const json = (await res.json()) as SmartSearchResponse
      setData(json)
    } catch {
      setError("Sorry, the search could not be completed. Please try again.")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Heading */}
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
          <Sparkles className="h-6 w-6 text-primary" />
        </span>
        <h1 className="text-balance text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Smart Parts Search
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Describe what you need in plain English — like &ldquo;engine for a 2019 Acura MDX under
          $4,000&rdquo; — and our AI will find the right parts from our inventory.
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          runSearch(query)
        }}
        className="mx-auto flex max-w-2xl items-center gap-2 rounded-xl border border-white/10 bg-card p-2 shadow-lg shadow-black/20"
      >
        <div className="flex flex-1 items-center gap-2 pl-2">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the part you're looking for..."
            className="w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={!query.trim() || loading} className="shrink-0 gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Search
        </Button>
      </form>

      {/* Example prompts */}
      {!searched && (
        <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex)
                runSearch(ex)
              }}
              className="rounded-full border border-white/10 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Interpreted filters */}
      {data?.filters && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-white/10 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Understood as:</span> {data.filters.intent}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.filters.model && <Badge variant="secondary" className="gap-1 text-[11px]"><Tag className="h-3 w-3" />{data.filters.model}</Badge>}
            {data.filters.year && <Badge variant="secondary" className="text-[11px]">{data.filters.year}</Badge>}
            {data.filters.category && <Badge variant="secondary" className="text-[11px]">{data.filters.category}</Badge>}
            {typeof data.filters.maxPrice === "number" && (
              <Badge variant="secondary" className="text-[11px]">≤ ${data.filters.maxPrice.toLocaleString()}</Badge>
            )}
          </div>
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="mt-10 flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Analyzing your request and searching inventory...</p>
        </div>
      )}

      {error && !loading && (
        <p className="mt-10 text-center text-sm text-destructive">{error}</p>
      )}

      {!loading && data && data.results.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-foreground">No matching parts found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different vehicle or part, or{" "}
            <Link href="/quote" className="text-primary underline underline-offset-2">
              request a quote
            </Link>
            .
          </p>
        </div>
      )}

      {/* Results grid */}
      {!loading && data && data.results.length > 0 && (
        <>
          <p className="mx-auto mt-6 max-w-6xl text-sm text-muted-foreground">
            {data.results.length} matching part{data.results.length === 1 ? "" : "s"}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.map((hit) => (
              <ResultCard key={hit.id} hit={hit} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function ResultCard({ hit }: { hit: CatalogHit }) {
  return (
    <Link
      href={hit.url}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/40">
        <Image
          src={hit.image || "/placeholder.svg"}
          alt={hit.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hit.condition && (
          <Badge className="absolute left-2 top-2 bg-black/70 text-[10px] capitalize text-white">
            {hit.condition}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-foreground">{hit.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {hit.model && <Badge variant="secondary" className="text-[10px]">{hit.model}</Badge>}
          {hit.year && <Badge variant="secondary" className="text-[10px]">{hit.year}</Badge>}
          <Badge variant="secondary" className="text-[10px] capitalize">{hit.category}</Badge>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-black text-foreground">${hit.price.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            View
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
