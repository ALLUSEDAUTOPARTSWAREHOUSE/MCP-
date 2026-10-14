"use client"

import { useState } from "react"
import { Validators, Factories } from "@/lib/test-utils"
import { AlertCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

interface ScenarioResult {
  label: string
  input: string
  expected: string
  actual: string
  pass: boolean
}

const SCENARIOS: Array<{
  label: string
  input: () => URLSearchParams
  expected: string
  note?: string
}> = [
  {
    label: "Valid full query",
    input: () => Factories.validSearchParams(),
    expected: "PASS — all fields valid",
  },
  {
    label: "Missing make field",
    input: () => Factories.invalidSearchParams.missingMake(),
    expected: "FAIL — make is required",
  },
  {
    label: "Unknown car make (InvalidBrand)",
    input: () => Factories.invalidSearchParams.unknownMake(),
    expected: "FAIL — make 'InvalidBrand' not recognised",
  },
  {
    label: "Year out of range (1800)",
    input: () => Factories.invalidSearchParams.badYear(),
    expected: "FAIL — year '1800' out of range",
  },
  {
    label: "Invalid ZIP (ABC12)",
    input: () => Factories.invalidSearchParams.badZip(),
    expected: "FAIL — ZIP is not 5 digits",
  },
  {
    label: "Invalid state code (XX)",
    input: () => Factories.invalidSearchParams.badState(),
    expected: "FAIL — state 'XX' not recognised",
  },
  {
    label: "Model incompatible with make",
    input: () => Factories.invalidSearchParams.incompatibleModel(),
    expected: "FAIL — Mustang not in Toyota models",
  },
  {
    label: "Make only (minimal valid)",
    input: () => new URLSearchParams({ make: "Honda" }),
    expected: "PASS — make-only is sufficient",
  },
  {
    label: "ZIP too short (123)",
    input: () => Factories.validSearchParams({ zip: "123" }),
    expected: "FAIL — ZIP must be 5 digits",
  },
  {
    label: "ZIP exactly 5 digits (10001)",
    input: () => Factories.validSearchParams({ zip: "10001" }),
    expected: "PASS — valid 5-digit ZIP",
  },
]

function runScenario(s: (typeof SCENARIOS)[number]): ScenarioResult {
  const params = s.input()
  const { valid, errors } = Validators.isValidSearchParams(params)
  const actual = valid ? "PASS — all fields valid" : `FAIL — ${errors[0]}`
  const pass = (valid && s.expected.startsWith("PASS")) || (!valid && s.expected.startsWith("FAIL"))
  return {
    label: s.label,
    input: decodeURIComponent(params.toString()),
    expected: s.expected,
    actual,
    pass,
  }
}

export function FormErrorScenarios() {
  const [results, setResults] = useState<ScenarioResult[]>([])
  const [ran, setRan] = useState(false)

  function run() {
    setResults(SCENARIOS.map(runScenario))
    setRan(true)
  }

  const passCount = results.filter((r) => r.pass).length
  const failCount = results.filter((r) => !r.pass).length

  return (
    <section className="glass-card rounded-lg overflow-hidden" aria-label="Form validation error scenarios">
      <div className="px-5 py-4 border-b border-border/25 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-foreground mb-1">Search Form Error Scenarios</h2>
          <p className="text-xs text-muted-foreground max-w-[560px]">
            Exercises the form validation layer against 10 named scenarios — covering missing fields,
            unrecognised values, incompatible combinations, and edge-case inputs. Each expected outcome
            is verified against the live validator.
          </p>
          {ran && (
            <div className="mt-2.5 flex gap-4 text-xs">
              <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{passCount} pass</span>
              <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />{failCount} fail</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={run}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider btn-led rounded shrink-0"
        >
          <RefreshCw className="w-3 h-3" aria-hidden="true" />
          {ran ? "Re-run" : "Run Scenarios"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="divide-y divide-border/15">
          {results.map((r) => (
            <div
              key={r.label}
              className={`px-5 py-3.5 flex items-start gap-3 transition-colors ${
                r.pass ? "hover:bg-green-500/5" : "hover:bg-red-500/5"
              }`}
            >
              {r.pass
                ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" aria-label="Scenario passed" />
                : <XCircle    className="w-4 h-4 text-red-400   shrink-0 mt-0.5" aria-label="Scenario failed" />
              }
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground mb-1">{r.label}</p>
                <p className="text-[10px] font-mono text-muted-foreground truncate mb-1">
                  Input: {r.input || "(empty)"}
                </p>
                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Expected: <span className="text-foreground">{r.expected}</span>
                  </span>
                  <span className={`text-[10px] ${r.pass ? "text-green-400" : "text-red-400"}`}>
                    Got: {r.actual}
                  </span>
                </div>
              </div>
              <AlertCircle
                className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${r.pass ? "text-transparent" : "text-yellow-400"}`}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      )}

      {!ran && (
        <div className="px-5 py-10 text-center">
          <p className="text-xs text-muted-foreground">
            Click <strong className="text-foreground">Run Scenarios</strong> to validate all {SCENARIOS.length} error conditions.
          </p>
        </div>
      )}
    </section>
  )
}
