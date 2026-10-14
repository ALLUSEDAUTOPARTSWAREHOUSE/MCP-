"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CAR_MAKES, CAR_MODELS, PART_CATEGORIES, YEARS, US_STATES, generateResults, type SearchResult } from "@/lib/data"
import { Search, Phone, MessageSquare, Shield, MapPin, Star, Check, Clock } from "lucide-react"
import Link from "next/link"

export function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [year, setYear] = useState(searchParams.get("year") || "")
  const [make, setMake] = useState(searchParams.get("make") || "")
  const [model, setModel] = useState(searchParams.get("model") || "")
  const [part, setPart] = useState(searchParams.get("part") || "")
  const [state, setState] = useState(searchParams.get("state") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [zip, setZip] = useState(searchParams.get("zip") || "")

  const [results, setResults] = useState<SearchResult[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const models = make ? CAR_MODELS[make] || [] : []

  useEffect(() => {
    if (searchParams.get("make")) {
      doSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function doSearch() {
    if (!make) return
    setLoading(true)
    setSearched(true)
    setTimeout(() => {
      const r = generateResults(year, make, model, part)
      setResults(r)
      setLoading(false)
    }, 800)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!make) return
    const params = new URLSearchParams()
    if (year) params.set("year", year)
    if (make) params.set("make", make)
    if (model) params.set("model", model)
    if (part) params.set("part", part)
    if (state) params.set("state", state)
    if (city) params.set("city", city)
    if (zip) params.set("zip", zip)
    router.replace(`/search?${params.toString()}`)
    doSearch()
  }

  const selectClass = "w-full font-sans text-sm px-3 py-2.5 bg-[rgba(13,15,22,0.75)] border border-border/50 rounded-lg text-foreground appearance-none focus:border-primary/55 focus:ring-1 focus:ring-primary/20 outline-none transition-all"

  const POPULAR_PARTS = ["Complete Engine","Automatic Transmission","Transfer Case","Alternator","Starter Motor","Radiator","A/C Compressor","CV Axle","Steering Rack","ECU / PCM Module","Cylinder Head","Turbocharger"]

  const searchTitle = [year, make, model, part].filter(Boolean).join(" ") || "Search Results"
  const stateName = state ? US_STATES.find(s => s.abbr === state)?.name : null
  const locParts = [stateName, city].filter(Boolean)
  const locStr = locParts.length ? ` near ${locParts.join(", ")}` : " nationwide"

  return (
    <div>
      {/* Search Hero */}
      <div className="bg-gradient-to-b from-[#0d0f16] to-background">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-8 sm:pt-12 pb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">Find the Right Part</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 max-w-[600px]">
            Select your vehicle to instantly search 2,000+ verified yards nationwide. In-stock results with pricing in seconds.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
            {["6-Month Warranty","2,000+ Verified Yards","Ships All 50 States","< 24-Hr Response","ASE-Certified Team"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-semibold text-muted-foreground">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary/60" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Search Widget */}
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-3 border-b border-border/20 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-foreground flex items-center gap-2">
                <Search className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" /> Search by Year, Make, Model & Part
              </span>
              <a href="tel:8888185001" className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block">
                <Phone className="w-3 h-3 inline mr-1" /> (888) 818-5001
              </a>
            </div>
            <div className="p-4 sm:p-7">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">Year</label>
                    <select className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
                      <option value="">-- Select Year --</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">Make</label>
                    <select className={selectClass} value={make} onChange={(e) => { setMake(e.target.value); setModel("") }} required>
                      <option value="">-- Select Make --</option>
                      {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">Model</label>
                    <select className={selectClass} value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                      <option value="">{make ? "-- Select Model --" : "-- Select Make First --"}</option>
                      {models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">Part Type</label>
                    <select className={selectClass} value={part} onChange={(e) => setPart(e.target.value)}>
                      <option value="">-- Select Part Type --</option>
                      {PART_CATEGORIES.map((cat) => (
                        <optgroup key={cat.id} label={cat.label}>
                          {cat.parts.map((p) => <option key={p} value={p}>{p}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">State</label>
                    <select className={selectClass} value={state} onChange={(e) => setState(e.target.value)}>
                      <option value="">All States</option>
                      {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">
                      City <span className="font-normal tracking-normal normal-case text-muted-foreground/60">(optional)</span>
                    </label>
                    <input type="text" className={selectClass} placeholder="e.g. Los Angeles" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2.5">Zip Code</label>
                    <input type="text" className={selectClass} placeholder="e.g. 90001" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value)} />
                  </div>
                </div>

                {/* Popular parts pills */}
                <div className="mb-6">
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-3">
                    Popular Parts -- Click to Quick-Select
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_PARTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`px-3.5 py-2 text-[11px] font-semibold rounded-full border transition-all ${
                          part === p
                            ? "bg-primary/20 border-primary/50 text-foreground"
                            : "bg-secondary/30 border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                        onClick={() => setPart(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button type="submit" disabled={!make} className="btn-led flex-1 min-w-[200px] inline-flex items-center justify-center gap-2.5 text-[0.75rem] font-bold tracking-[0.18em] uppercase px-6 py-4 rounded-lg transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                    <Search className="w-4 h-4" /> Search Available Parts
                  </button>
                  <a href="tel:8888185001" className="inline-flex items-center justify-center gap-2 px-6 py-4 text-[0.7rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-lg hover:border-foreground/50 hover:text-foreground transition-all">
                    <Phone className="w-3.5 h-3.5" /> Call & Order
                  </a>
                  <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-4 text-[0.7rem] font-bold tracking-[0.18em] uppercase border border-border/60 text-muted-foreground rounded-lg hover:border-foreground/50 hover:text-foreground transition-all">
                    <MessageSquare className="w-3.5 h-3.5" /> Free Quote
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-8 sm:py-10">
        {!searched && !loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto opacity-30" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Search Our Nationwide Inventory</h3>
            <p className="text-sm text-muted-foreground max-w-[400px] mx-auto">
              Select your vehicle year, make, model and the part you need above, then click Search to see pricing from verified yards.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-foreground/20 border-t-foreground/70 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Searching 2,000+ verified yards...</p>
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 text-muted-foreground">
              <Search className="w-16 h-16 mx-auto opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Results Found</h3>
            <p className="text-sm text-muted-foreground max-w-[480px] mx-auto mb-6 leading-relaxed">
              We couldn't find parts matching your search criteria. Try adjusting your filters or contact our team to source from additional yards.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="tel:8888185001" className="btn-led inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                <Phone className="w-3.5 h-3.5" /> Call Us for Help
              </a>
              <Link href="/quote" className="w-40 inline-block hover:-translate-y-1 transition-transform duration-200">
                <img src="/images/button-request-free-quote.png" alt="Request Free Quote" className="w-full h-auto drop-shadow-lg" />
              </Link>
            </div>
          </div>
        )}

        {searched && !loading && results.length > 0 && (
          <>
            <div className="glass-card rounded-lg px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">{searchTitle}</h2>
                <p className="text-xs text-muted-foreground">{results.length} results found{locStr}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">Prices are estimates -- confirm with dealer</span>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              {results.map((r) => (
                <div key={r.id} className="glass-card rounded-lg p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{r.yard.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {r.yard.city}, {r.yard.state}
                        </p>
                      </div>
                      {r.inStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase rounded-sm bg-green-500/10 text-green-400 border border-green-500/20">
                          <Check className="w-3 h-3" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase rounded-sm bg-secondary border border-border/40 text-muted-foreground">
                          <Clock className="w-3 h-3" /> On Order
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground mb-4">
                      <span>Mileage: <strong className="text-foreground">{r.miles.toLocaleString()} mi</strong></span>
                      <span>Condition: <strong className="text-foreground">{r.condition}</strong></span>
                      <span>Warranty: <strong className="text-foreground">{r.warranty}</strong></span>
                      <span>Ships in: <strong className="text-foreground">{r.shipping} days</strong></span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.yard.rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"}`} />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">({r.yard.reviews})</span>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between shrink-0 sm:min-w-[140px] pt-3 sm:pt-0 border-t sm:border-t-0 border-border/20">
                    <div className="text-left sm:text-right">
                      <div className="font-serif text-xl sm:text-2xl font-bold text-foreground">${r.price}</div>
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground">Estimated price</div>
                    </div>
                    <div className="flex gap-2 sm:mt-4">
                      <Link href="/quote" className="btn-led inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase rounded-sm">
                        Get Quote
                      </Link>
                      <a href="tel:8888185001" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase border border-border/60 text-muted-foreground rounded-sm hover:border-foreground/50 hover:text-foreground transition-all">
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Not found CTA */}
            <div className="text-center mt-10 pt-8">
              <div className="metal-line mb-7" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{"Don't see the right part?"}</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[380px] mx-auto leading-relaxed">
                Our team can source from additional yards not listed here. Call or request a quote for immediate assistance.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="tel:8888185001" className="btn-led inline-flex items-center justify-center gap-2 px-5 py-3 text-[0.68rem] font-bold tracking-[0.18em] uppercase rounded-sm">
                  <Phone className="w-3.5 h-3.5" /> Call (888) 818-5001
                </a>
                <Link href="/quote" className="w-40 inline-block hover:-translate-y-1 transition-transform duration-200">
                  <img src="/images/button-request-free-quote.png" alt="Request Free Quote" className="w-full h-auto drop-shadow-lg" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
