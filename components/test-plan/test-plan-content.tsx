"use client"

import { useState } from "react"
import { SuiteRunner } from "@/components/test-plan/suite-runner"
import { RouteChecker } from "@/components/test-plan/route-checker"
import { FormErrorScenarios } from "@/components/test-plan/form-error-scenarios"
import { ErrorBoundary } from "@/components/error-boundary"
import { Database, Search, Image, Map, AlertTriangle, FlaskConical, ChevronRight } from "lucide-react"

// ─── Section headings data ─────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",       label: "Overview",            icon: FlaskConical  },
  { id: "data",           label: "Data Validation",     icon: Database      },
  { id: "search-params",  label: "Search Params",       icon: Search        },
  { id: "images",         label: "Image Fallbacks",     icon: Image         },
  { id: "routes",         label: "Route Scenarios",     icon: Map           },
  { id: "form-errors",    label: "Form Error Cases",    icon: AlertTriangle },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

// ─── Plan strategy card ────────────────────────────────────────────────────────

const STRATEGY_ITEMS = [
  {
    title: "Data Layer Integrity",
    icon: Database,
    items: [
      "All CAR_MAKES entries have a corresponding CAR_MODELS array.",
      "YEARS is descending and spans at least 30 years.",
      "US_STATES contains exactly 50 entries with valid abbreviations.",
      "Every PART_CATEGORIES entry has a non-empty parts array.",
      "BRAND_LOGOS values are valid, HTTPS-prefixed URLs.",
      "generateResults() returns results for valid inputs and empty array for blank make.",
    ],
  },
  {
    title: "Search Parameter Validation",
    icon: Search,
    items: [
      "make is required; absence produces a FAIL result.",
      "Unrecognised make values (e.g. Fiat, UnknownBrand) are rejected.",
      "model is validated against the selected make's model list.",
      "year must fall within the supported YEARS range.",
      "zip must be exactly 5 numeric digits.",
      "state must be a recognised US 2-letter abbreviation.",
    ],
  },
  {
    title: "Image & Logo Error Resilience",
    icon: Image,
    items: [
      "Every brand logo URL is well-formed and uses HTTPS.",
      "An onError handler retries once then falls back to a letter monogram.",
      "The fallback <span> is announced correctly to screen readers.",
      "The img element always carries a meaningful alt attribute.",
      "Lazy loading is applied to avoid blocking the initial paint.",
    ],
  },
  {
    title: "Route & Redirect Coverage",
    icon: Map,
    items: [
      "All known pages (/, /search, /parts, /makes, /about, /contact, /quote) return 200.",
      "/parts/[category] with valid IDs (engines, transmissions…) return 200.",
      "/parts/[category] with unknown IDs call notFound() → 404.",
      "Deeply nested unknown paths correctly 404.",
      "Search with an unrecognised make still renders (0 results, no crash).",
      "Search query strings are mirrored in the URL via router.replace().",
    ],
  },
  {
    title: "Form Error & UX Resilience",
    icon: AlertTriangle,
    items: [
      "Submit without make shows an inline accessible error message.",
      "ZIP field strips non-numeric chars and enforces 5-char max.",
      "Model select is disabled and labelled 'Select Make First' until make is chosen.",
      "All form controls have htmlFor ↔ id bindings for keyboard/AT accessibility.",
      "aria-required, aria-invalid, aria-describedby are set on required fields.",
      "Errors are announced via role='alert' for screen reader users.",
    ],
  },
]

function StrategyCard({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: string[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
      >
        <Icon className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <span className="flex-1 text-sm font-bold text-foreground">{title}</span>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <ul className="px-5 pb-4 space-y-2 border-t border-border/20" aria-label={`${title} checklist`}>
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0 mt-1.5" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Main content ──────────────────────────────────────────────────────────────

export function TestPlanContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview")

  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-br from-background via-card to-background border-b border-border/30">
        <div className="metal-line" />
        <div className="mx-auto max-w-[1280px] px-6 py-14">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" aria-hidden="true" />
            <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">QA & Verification</span>
          </div>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] font-bold text-foreground mb-3">
                Comprehensive Testing Plan
              </h1>
              <p className="text-sm text-muted-foreground max-w-[640px] leading-relaxed">
                Interactive test dashboard covering data layer integrity, search parameter validation,
                image fallback resilience, full route scenario coverage, and form error handling.
                Click any suite below to run live assertions in the browser.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0 text-xs text-muted-foreground min-w-[160px]">
              {[
                ["Test Suites",    "4 runnable suites"],
                ["Scenarios",     "10 form error cases"],
                ["Route checks",  "16 path scenarios"],
                ["Image checks",  "31 logo URLs"],
                ["Data tests",    "12 assertions"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span>{label}</span>
                  <span className="font-bold text-foreground tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-border/30 bg-secondary/10 sticky top-[58px] z-10 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6">
          <nav aria-label="Test plan sections" className="flex gap-0 overflow-x-auto">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                aria-current={activeSection === id ? "page" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeSection === id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-[1280px] px-6 py-10 space-y-8">

        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="glass-card rounded-lg px-6 py-5 border-l-2 border-l-primary/60">
              <h2 className="text-sm font-bold text-foreground mb-2">Testing Strategy</h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[720px]">
                The plan validates all five layers of the application: the <strong className="text-foreground">data layer</strong> (static
                constants in lib/data.ts), the <strong className="text-foreground">URL parameter layer</strong> (query string parsing and
                validation), the <strong className="text-foreground">asset layer</strong> (brand logo URLs and graceful degradation),
                the <strong className="text-foreground">routing layer</strong> (correct status codes and notFound() invocations), and
                the <strong className="text-foreground">form layer</strong> (client-side validation, ARIA, and error messages).
                Use the tabs above to navigate to each live test runner.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {STRATEGY_ITEMS.map((item) => (
                <StrategyCard key={item.title} {...item} />
              ))}
            </div>

            <div className="glass-card rounded-lg px-6 py-5">
              <h2 className="text-sm font-bold text-foreground mb-4">Error Simulation Scenarios</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[560px]" aria-label="Error simulation matrix">
                  <thead>
                    <tr className="border-b border-border/25">
                      <th scope="col" className="pb-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Scenario</th>
                      <th scope="col" className="pb-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">How to Trigger</th>
                      <th scope="col" className="pb-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Expected Behaviour</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/15">
                    {[
                      ["Submit search without make",     "Leave Make select at default, click Search",            "Inline error below Make — form does not navigate"],
                      ["Invalid ZIP code",               "Type letters or fewer than 5 digits in ZIP field",       "Input strips non-numeric chars; error shown on submit"],
                      ["Logo image 404",                 "Network blocks carlogos.org",                            "onError fallback renders brand initial letter monogram"],
                      ["Navigate to /parts/xyz",         "Visit a non-existent category slug",                    "Next.js notFound() → custom 404 page rendered"],
                      ["Navigate to /does-not-exist",    "Any completely unknown path",                           "Custom 404 page with navigation back to home"],
                      ["Search with empty make param",   "Visit /search?year=2020 (no make)",                     "0 results, empty-state prompt shown, no JS error"],
                      ["Unknown make in URL",            "Visit /search?make=Atlantis",                           "generateResults returns [] → graceful empty state"],
                      ["JS runtime error in component",  "ErrorBoundary catches unhandled throws",                "Error section shows 'Something went wrong' + Retry"],
                      ["Model without make selected",    "Model dropdown is disabled until make chosen",          "Disabled select, label reads 'Select Make First'"],
                    ].map(([scenario, trigger, expected]) => (
                      <tr key={scenario} className="hover:bg-secondary/10 transition-colors">
                        <td className="py-2.5 pr-4 font-medium text-foreground align-top">{scenario}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground align-top">{trigger}</td>
                        <td className="py-2.5 text-muted-foreground align-top">{expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === "data" && (
          <ErrorBoundary context="Data Validation Suite">
            <SuiteRunner
              suiteKey="data"
              title="Data Layer Validation"
              description="Asserts the integrity of all static data in lib/data.ts: makes, models, years, states, part categories, brand logos, and search result generation."
            />
          </ErrorBoundary>
        )}

        {activeSection === "search-params" && (
          <ErrorBoundary context="Search Params Suite">
            <SuiteRunner
              suiteKey="search-params"
              title="Search Parameter Validation"
              description="Runs 10 named URL query-string scenarios through the Validators.isValidSearchParams() utility and asserts pass/fail against expected outcomes."
            />
          </ErrorBoundary>
        )}

        {activeSection === "images" && (
          <ErrorBoundary context="Image Fallback Suite">
            <SuiteRunner
              suiteKey="images"
              title="Brand Logo URL Integrity"
              description="Verifies every BRAND_LOGOS entry is a well-formed HTTPS URL. WARN status is shown for HTTP-only URLs. FAIL for malformed values. The BrandCard component's onError fallback is documented alongside."
            />
          </ErrorBoundary>
        )}

        {activeSection === "routes" && (
          <ErrorBoundary context="Route Checker">
            <RouteChecker />
          </ErrorBoundary>
        )}

        {activeSection === "form-errors" && (
          <ErrorBoundary context="Form Error Scenarios">
            <FormErrorScenarios />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}
