'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { CAR_MAKES, CAR_MODELS, PART_CATEGORIES, YEARS } from '@/lib/data'
import { getPartsSearchUrl } from '@/lib/parts-search-routing'

interface BrandProductSearchProps {
  defaultMake?: string
}

const selectClass =
  'w-full appearance-none rounded-xl border border-border/60 bg-background px-4 py-4 pr-10 text-base font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50'

const selectStyle = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3E%3Cpath fill=%27%23888%27 d=%27M1 1l5 5 5-5%27/%3E%3C/svg%3E")',
  backgroundPosition: 'right 1rem center',
  backgroundRepeat: 'no-repeat',
}

export function BrandProductSearch({ defaultMake = '' }: BrandProductSearchProps) {
  const router = useRouter()
  const [make, setMake] = useState(defaultMake)
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [part, setPart] = useState('')

  const models = useMemo(() => (make ? [...(CAR_MODELS[make] || [])].sort() : []), [make])
  const partTypes = useMemo(() => PART_CATEGORIES.map((category) => category.label).sort(), [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push(getPartsSearchUrl({ make, model, year, partType: part }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/50 bg-card/70 p-6 shadow-lg md:p-9"
      aria-label="Search for another auto part"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <label htmlFor="product-search-make" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Make <span aria-hidden="true">*</span>
          </label>
          <select
            id="product-search-make"
            value={make}
            onChange={(event) => {
              setMake(event.target.value)
              setModel('')
            }}
            className={selectClass}
            style={selectStyle}
            required
          >
            <option value="">Select Make</option>
            {CAR_MAKES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="product-search-model" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Model</label>
          <select
            id="product-search-model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            disabled={!make}
            className={selectClass}
            style={selectStyle}
          >
            <option value="">{make ? 'Select Model' : 'Select Make First'}</option>
            {models.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="product-search-year" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Year</label>
          <select
            id="product-search-year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            disabled={!make}
            className={selectClass}
            style={selectStyle}
          >
            <option value="">{make ? 'Select Year' : 'Select Make First'}</option>
            {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="product-search-part" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Part Type</label>
          <select
            id="product-search-part"
            value={part}
            onChange={(event) => setPart(event.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            <option value="">Select Part Type</option>
            {partTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
        Search Parts
      </button>
    </form>
  )
}
