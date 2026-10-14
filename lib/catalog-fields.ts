/**
 * Pure field derivation shared by the runtime catalog loader and the
 * build-time index script (scripts/build-catalog-index.mjs). No imports so it
 * runs under plain Node type-stripping as well as in Next.js.
 */

/** Rows carrying this price are placeholders and must never be shown. */
export const PLACEHOLDER_PRICE = 799

export type SalesMode = "buy_now" | "quote"
export type PartType = "engine" | "transmission"
export type Gearbox = "AT" | "MT" | "CVT"

export interface RawCatalogRow {
  name: string
  price: number
  category?: string
  year?: string
  tiers?: { low: number; medium: number; high: number }
  /** Set by scripts/import-master-sheets.mjs from the master sheet's Price column. */
  salesMode?: SalesMode
  /** Clean model name from the master sheet's Model column. */
  modelClean?: string
}

export interface DerivedFields {
  salesMode: SalesMode
  partType: PartType
  modelName: string
  variant: string
  engineSize?: string
  gearbox?: Gearbox
  vinCode?: string
  yearNumber?: number
  /** Mileage tiers in buyer language. Only present for buy_now rows. */
  priceTiers?: { saver: number; standard: number; premium: number }
}

export function getSalesMode(row: Pick<RawCatalogRow, "price" | "salesMode">): SalesMode {
  if (!row.price || row.price === PLACEHOLDER_PRICE) return "quote"
  return row.salesMode ?? "buy_now"
}

/**
 * The title ("2010 Toyota Camry Engine - ...") is authoritative; the sheet's
 * category column is mislabelled on many rows, so it is only a fallback.
 */
export function getPartType(row: Pick<RawCatalogRow, "category" | "name">): PartType {
  const head = (row.name || "").split(" - ")[0].toLowerCase()
  if (/\btransmission\b/.test(head)) return "transmission"
  if (/\bengine\b/.test(head)) return "engine"
  return (row.category ?? "").toLowerCase().includes("transmission") ? "transmission" : "engine"
}

const MAKE_PREFIXES = [
  "alfa romeo",
  "aston martin",
  "land rover",
  "landrover",
  "mercedes-benz",
  "mercedes benz",
  "mercedes",
  "chevrolet",
  "chevy",
  "volkswagen",
  "vw",
]

function cleanVariant(raw: string): string {
  return raw
    .replace(/"{2,}/g, '"')
    .replace(/\.{3}$/, "")
    .replace(/[,;(\s]+$/, "")
    .trim()
}

export function deriveFields(row: RawCatalogRow, makeLabel: string): DerivedFields {
  const name = row.name || ""
  const dashIndex = name.indexOf(" - ")
  const head = dashIndex >= 0 ? name.slice(0, dashIndex) : name
  const variant = dashIndex >= 0 ? cleanVariant(name.slice(dashIndex + 3)) : ""

  let rest = head.replace(/^\s*\d{4}\s+/, "").replace(/\s+(engine|transmission)\s*$/i, "").trim()
  const lowerRest = rest.toLowerCase()
  const label = makeLabel.toLowerCase()
  const prefix = [label, ...MAKE_PREFIXES].find((p) => lowerRest.startsWith(`${p} `))
  if (prefix) {
    rest = rest.slice(prefix.length).trim()
  } else {
    rest = rest.split(/\s+/).slice(1).join(" ")
  }
  if (/^benz\s/i.test(rest)) rest = rest.slice(5).trim()

  const engineSize = name.match(/(\d{1,2}\.\d)\s?L\b/i)?.[1]
  const vinCode = name.match(/VIN\s+([A-Z0-9]{1,2})\b/)?.[1]

  let gearbox: Gearbox | undefined
  if (/\bCVT\b/.test(variant)) gearbox = "CVT"
  else if (/\bAT\b/.test(variant)) gearbox = "AT"
  else if (/\bMT\b/.test(variant)) gearbox = "MT"

  const yearNumber = Number.parseInt(String(row.year ?? head.slice(0, 4)), 10)
  const salesMode = getSalesMode(row)

  return {
    salesMode,
    partType: getPartType(row),
    modelName: row.modelClean || rest || "Other",
    variant,
    engineSize: engineSize ? `${engineSize}L` : undefined,
    gearbox,
    vinCode,
    yearNumber: Number.isFinite(yearNumber) ? yearNumber : undefined,
    priceTiers:
      salesMode === "buy_now"
        ? {
            saver: row.tiers?.high ?? row.price,
            standard: row.tiers?.medium ?? row.price,
            premium: row.tiers?.low ?? row.price,
          }
        : undefined,
  }
}

export function slugifyModel(model: string): string {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
