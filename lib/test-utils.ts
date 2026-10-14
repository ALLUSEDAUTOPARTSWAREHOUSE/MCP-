/**
 * AUAPW Test Utilities
 * ─────────────────────────────────────────────────────────────────────────────
 * Mock data factories, validation helpers, scenario simulators, and assertion
 * utilities used by the interactive /test-plan dashboard.
 */

import {
  CAR_MAKES,
  CAR_MODELS,
  PART_CATEGORIES,
  YEARS,
  US_STATES,
  BRAND_LOGOS,
  generateResults,
} from "@/lib/data"

// ─── Types ────────────────────────────────────────────────────────────────────

export type TestStatus = "pass" | "fail" | "warn" | "pending" | "running"

export interface TestResult {
  id: string
  name: string
  description: string
  status: TestStatus
  detail?: string
  duration?: number
}

export interface TestSuite {
  id: string
  name: string
  category: string
  tests: TestResult[]
}

// ─── Validators ───────────────────────────────────────────────────────────────

export const Validators = {
  isValidMake: (make: string): boolean => CAR_MAKES.includes(make),

  isValidModel: (make: string, model: string): boolean => {
    const models = CAR_MODELS[make]
    return Array.isArray(models) && models.includes(model)
  },

  isValidYear: (year: string): boolean => YEARS.includes(year),

  isValidZip: (zip: string): boolean => /^\d{5}$/.test(zip),

  isValidStateAbbr: (abbr: string): boolean =>
    US_STATES.some((s) => s.abbr === abbr),

  isValidPartName: (part: string): boolean =>
    PART_CATEGORIES.some((cat) => cat.parts.includes(part)),

  isValidCategoryId: (id: string): boolean =>
    PART_CATEGORIES.some((cat) => cat.id === id),

  isValidUrl: (url: string): boolean => {
    // Accept local paths starting with /
    if (url.startsWith("/")) return true
    // Also accept full URLs
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  isValidSearchParams: (params: URLSearchParams): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    const make = params.get("make")
    const model = params.get("model")
    const year = params.get("year")
    const zip = params.get("zip")
    const state = params.get("state")

    if (!make) errors.push("make is required")
    if (make && !CAR_MAKES.includes(make)) errors.push(`make "${make}" is not recognized`)
    if (model && make && !Validators.isValidModel(make, model))
      errors.push(`model "${model}" is not valid for make "${make}"`)
    if (year && !Validators.isValidYear(year)) errors.push(`year "${year}" is out of range`)
    if (zip && !Validators.isValidZip(zip)) errors.push(`zip "${zip}" is not a valid 5-digit code`)
    if (state && !Validators.isValidStateAbbr(state))
      errors.push(`state "${state}" is not a valid US state abbreviation`)

    return { valid: errors.length === 0, errors }
  },
}

// ─── Mock Data Factories ─────────────────────────────────────────────────────

export const Factories = {
  validSearchParams: (overrides: Record<string, string> = {}): URLSearchParams => {
    const p = new URLSearchParams({
      year: "2018",
      make: "Toyota",
      model: "Camry",
      part: "Complete Engine",
      state: "CA",
      city: "Los Angeles",
      zip: "90001",
      ...overrides,
    })
    return p
  },

  invalidSearchParams: {
    missingMake: () => new URLSearchParams({ year: "2018", model: "Camry" }),
    unknownMake: () => new URLSearchParams({ make: "InvalidBrand" }),
    badYear: () => new URLSearchParams({ make: "Toyota", year: "1800" }),
    badZip: () => new URLSearchParams({ make: "Toyota", zip: "ABC12" }),
    badState: () => new URLSearchParams({ make: "Toyota", state: "XX" }),
    incompatibleModel: () => new URLSearchParams({ make: "Toyota", model: "Mustang" }),
  },

  logoImageUrl: (brand: string): string | undefined => BRAND_LOGOS[brand],

  searchResultsFor: (make: string, part = "Complete Engine") =>
    generateResults("2018", make, "", part),
}

// ─── Route Scenario Definitions ───────────────────────────────────────────────

export interface RouteScenario {
  label: string
  path: string
  expectStatus: "ok" | "not-found" | "redirect"
  expectContent?: string
  notes?: string
}

export const ROUTE_SCENARIOS: RouteScenario[] = [
  { label: "Home", path: "/", expectStatus: "ok", expectContent: "AUAPW" },
  { label: "Search (no params)", path: "/search", expectStatus: "ok", expectContent: "Search" },
  { label: "Search – valid make", path: "/search?make=Toyota", expectStatus: "ok" },
  { label: "Search – full params", path: "/search?year=2018&make=Toyota&model=Camry&part=Complete+Engine&state=CA&zip=90001", expectStatus: "ok" },
  { label: "Search – unknown make", path: "/search?make=UnknownBrand", expectStatus: "ok", notes: "Should show 0 results gracefully" },
  { label: "Search – bad zip", path: "/search?make=Toyota&zip=BADZIP", expectStatus: "ok", notes: "UI should surface validation warning" },
  { label: "Parts index", path: "/parts", expectStatus: "ok" },
  { label: "Parts – engines", path: "/parts/engines", expectStatus: "ok" },
  { label: "Parts – transmissions", path: "/parts/transmissions", expectStatus: "ok" },
  { label: "Parts – invalid category", path: "/parts/not-a-category", expectStatus: "not-found" },
  { label: "Makes", path: "/makes", expectStatus: "ok" },
  { label: "About", path: "/about", expectStatus: "ok" },
  { label: "Contact", path: "/contact", expectStatus: "ok" },
  { label: "Quote", path: "/quote", expectStatus: "ok" },
  { label: "404 – unknown path", path: "/does-not-exist", expectStatus: "not-found" },
  { label: "404 – deep unknown", path: "/parts/engines/subpart/unknown", expectStatus: "not-found" },
]

// ─── Test Suites ──────────────────────────────────────────────────────────────

export function runDataValidationSuite(): TestResult[] {
  const t = (
    id: string,
    name: string,
    description: string,
    fn: () => boolean | { pass: boolean; detail: string }
  ): TestResult => {
    const start = performance.now()
    try {
      const result = fn()
      const pass = typeof result === "boolean" ? result : result.pass
      const detail = typeof result === "object" ? result.detail : undefined
      return {
        id,
        name,
        description,
        status: pass ? "pass" : "fail",
        detail,
        duration: Math.round((performance.now() - start) * 100) / 100,
      }
    } catch (err) {
      return {
        id,
        name,
        description,
        status: "fail",
        detail: err instanceof Error ? err.message : String(err),
        duration: Math.round((performance.now() - start) * 100) / 100,
      }
    }
  }

  return [
    t("dv-1", "CAR_MAKES is non-empty array", "lib/data exports at least one car make", () => Array.isArray(CAR_MAKES) && CAR_MAKES.length > 0),
    t("dv-2", "All makes have models", "Every entry in CAR_MAKES has a corresponding CAR_MODELS entry", () => {
      const missing = CAR_MAKES.filter((m) => !Array.isArray(CAR_MODELS[m]) || CAR_MODELS[m].length === 0)
      return { pass: missing.length === 0, detail: missing.length ? `Missing: ${missing.join(", ")}` : "All present" }
    }),
    t("dv-3", "YEARS covers at least 30 years", "YEARS array has sufficient coverage", () => YEARS.length >= 30),
    t("dv-4", "YEARS are descending strings", "Most recent year is first", () => Number(YEARS[0]) > Number(YEARS[YEARS.length - 1])),
    t("dv-5", "All 50 US states present", "US_STATES has exactly 50 entries", () => US_STATES.length === 50),
    t("dv-6", "PART_CATEGORIES non-empty", "At least one category defined", () => PART_CATEGORIES.length > 0),
    t("dv-7", "Each part category has parts", "No empty parts arrays", () => {
      const empty = PART_CATEGORIES.filter((c) => c.parts.length === 0)
      return { pass: empty.length === 0, detail: empty.length ? `Empty: ${empty.map((c) => c.id).join(", ")}` : "All ok" }
    }),
    t("dv-8", "BRAND_LOGOS has entries", "At least 10 brand logos defined", () => Object.keys(BRAND_LOGOS).length >= 10),
    t("dv-9", "Brand logo URLs are valid", "All logo values are well-formed URLs", () => {
      const bad = Object.entries(BRAND_LOGOS).filter(([, url]) => typeof url === 'string' && !Validators.isValidUrl(url))
      return { pass: bad.length === 0, detail: bad.length ? `Bad URLs for: ${bad.map(([b]) => b).join(", ")}` : "All valid" }
    }),
    t("dv-10", "generateResults – valid make returns results", "Engine search for Toyota returns 1+ results", () => {
      const r = generateResults("2018", "Toyota", "Camry", "Complete Engine")
      return { pass: r.length > 0, detail: `Got ${r.length} result(s)` }
    }),
    t("dv-11", "generateResults – empty make returns empty", "No make = no results", () => generateResults("2018", "", "", "") .length === 0),
    t("dv-12", "All result prices are positive", "Prices from generateResults are > 0", () => {
      const results = generateResults("2019", "Honda", "Accord", "Alternator")
      const bad = results.filter((r) => r.price <= 0)
      return { pass: bad.length === 0, detail: bad.length ? `${bad.length} non-positive price(s)` : "All positive" }
    }),
  ]
}

export function runSearchParamValidationSuite(): TestResult[] {
  const run = (id: string, name: string, desc: string, params: URLSearchParams, expectValid: boolean, noteOverride?: string): TestResult => {
    const start = performance.now()
    const { valid, errors } = Validators.isValidSearchParams(params)
    const pass = valid === expectValid
    return {
      id,
      name,
      description: desc,
      status: pass ? "pass" : "fail",
      detail: noteOverride ?? (errors.length ? errors.join(" | ") : "All params valid"),
      duration: Math.round((performance.now() - start) * 100) / 100,
    }
  }

  return [
    run("sp-1", "Full valid params pass", "year+make+model+part+state+zip all correct", Factories.validSearchParams(), true),
    run("sp-2", "Missing make fails", "make is required — should be invalid", Factories.invalidSearchParams.missingMake(), false),
    run("sp-3", "Unknown make fails", "Unrecognised brand returns invalid", Factories.invalidSearchParams.unknownMake(), false),
    run("sp-4", "Bad year fails", "Out-of-range year is invalid", Factories.invalidSearchParams.badYear(), false),
    run("sp-5", "Bad zip fails", "Non-numeric zip is invalid", Factories.invalidSearchParams.badZip(), false),
    run("sp-6", "Bad state fails", "Invalid state abbr is invalid", Factories.invalidSearchParams.badState(), false),
    run("sp-7", "Incompatible model fails", "Model not belonging to make is invalid", Factories.invalidSearchParams.incompatibleModel(), false),
    run("sp-8", "Make-only is valid", "Only make provided — minimal valid case", new URLSearchParams({ make: "Honda" }), true),
    run("sp-9", "Model without make is invalid", "Model alone is missing required make", new URLSearchParams({ model: "Civic" }), false),
    run("sp-10", "Valid zip passes", "5-digit numeric zip is valid", Factories.validSearchParams({ zip: "10001" }), true),
  ]
}

export function runImageFallbackSuite(): TestResult[] {
  return Object.keys(BRAND_LOGOS).map((brand, i) => {
    const url = BRAND_LOGOS[brand]
    const isValid = Validators.isValidUrl(url)
    const isHttps = url.startsWith("https://")
    const status: TestStatus = isValid && isHttps ? "pass" : isValid ? "warn" : "fail"
    return {
      id: `img-${i + 1}`,
      name: `${brand} logo URL`,
      description: `Logo URL for ${brand} is valid and uses HTTPS`,
      status,
      detail: !isValid ? `Malformed URL: ${url}` : !isHttps ? "Uses HTTP, not HTTPS" : url,
    }
  })
}

export function runRouteSuite(): TestResult[] {
  return ROUTE_SCENARIOS.map((scenario, i) => ({
    id: `rt-${i + 1}`,
    name: scenario.label,
    description: `${scenario.path} → expect ${scenario.expectStatus}`,
    status: "pending" as TestStatus,
    detail: scenario.notes,
  }))
}

// ─── Aggregate runner ─────────────────────────────────────────────────────────

export type SuiteKey = "data" | "search-params" | "images" | "routes"

export function runSuite(key: SuiteKey): TestResult[] {
  switch (key) {
    case "data":          return runDataValidationSuite()
    case "search-params": return runSearchParamValidationSuite()
    case "images":        return runImageFallbackSuite()
    case "routes":        return runRouteSuite()
  }
}

export function suiteStats(results: TestResult[]) {
  const pass    = results.filter((r) => r.status === "pass").length
  const fail    = results.filter((r) => r.status === "fail").length
  const warn    = results.filter((r) => r.status === "warn").length
  const pending = results.filter((r) => r.status === "pending").length
  const total   = results.length
  return { pass, fail, warn, pending, total }
}
