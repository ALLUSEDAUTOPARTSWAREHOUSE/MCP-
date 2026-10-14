import indexData from "@/data/catalog-index.json"
import type { PartType } from "@/lib/catalog-fields"

export interface IndexModel {
  name: string
  slug: string
  count: number
  engines: number
  transmissions: number
  years: number[]
}

export interface IndexMake {
  slug: string
  label: string
  count: number
  buyNow: number
  quote: number
  engines: number
  transmissions: number
  yearMin: number | null
  yearMax: number | null
  models: IndexModel[]
}

export interface PopularListing {
  brand: string
  brandLabel: string
  slug: string
  name: string
  year: number
  model: string
  variant: string
  engineSize: string | null
  priceTiers: { saver: number; standard: number; premium: number }
}

export interface CatalogIndex {
  totals: {
    parts: number
    buyNow: number
    quote: number
    engines: number
    transmissions: number
    makes: number
  }
  makes: IndexMake[]
  popular: PopularListing[]
}

export const CATALOG_INDEX = indexData as CatalogIndex

export function getIndexMake(slug: string): IndexMake | undefined {
  return CATALOG_INDEX.makes.find((m) => m.slug === slug)
}

export function getMakeModelsForPart(make: IndexMake, partType?: PartType): IndexModel[] {
  if (!partType) return make.models
  return make.models.filter((m) => (partType === "engine" ? m.engines > 0 : m.transmissions > 0))
}

export function formatYearRange(min: number | null, max: number | null): string {
  if (!min || !max) return ""
  return min === max ? String(min) : `${min}–${max}`
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US")
}
