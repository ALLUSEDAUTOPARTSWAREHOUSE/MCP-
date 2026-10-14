"use client"

import { useState, useCallback, useTransition } from "react"
import {
  runSuite,
  suiteStats,
  type SuiteKey,
  type TestResult,
  type TestStatus,
} from "@/lib/test-utils"
import { CheckCircle2, XCircle, AlertTriangle, Clock, Loader2, Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_META: Record<TestStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  pass:    { icon: CheckCircle2,  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/25",  label: "PASS" },
  fail:    { icon: XCircle,       color: "text-red-400",    bg: "bg-red-500/10 border-red-500/25",      label: "FAIL" },
  warn:    { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/25",label: "WARN" },
  pending: { icon: Clock,         color: "text-muted-foreground", bg: "bg-secondary border-border/40",  label: "PENDING" },
  running: { icon: Loader2,       color: "text-primary",    bg: "bg-primary/10 border-primary/25",     label: "RUNNING" },
}

function StatusBadge({ status }: { status: TestStatus }) {
  const { icon: Icon, color, bg, label } = STATUS_META[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase rounded border ${bg} ${color}`}>
      <Icon className={`w-3 h-3 ${status === "running" ? "animate-spin" : ""}`} aria-hidden="true" />
      {label}
    </span>
  )
}

// ─── Single test row ──────────────────────────────────────────────────────────

function TestRow({ test }: { test: TestResult }) {
  const [open, setOpen] = useState(false)
  const hasDetail = !!test.detail
  const { color } = STATUS_META[test.status]

  return (
    <div className="border-b border-border/20 last:border-b-0">
      <button
        type="button"
        onClick={() => hasDetail && setOpen((o) => !o)}
        disabled={!hasDetail}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/20 disabled:cursor-default"
        aria-expanded={hasDetail ? open : undefined}
      >
        <StatusBadge status={test.status} />
        <span className="flex-1 text-xs font-medium text-foreground truncate">{test.name}</span>
        <span className="text-[10px] text-muted-foreground hidden sm:block shrink-0 max-w-[260px] truncate text-right">
          {test.description}
        </span>
        {test.duration !== undefined && (
          <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{test.duration}ms</span>
        )}
        {hasDetail && (
          <span className={`ml-1 shrink-0 ${color}`} aria-hidden="true">
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        )}
      </button>
      {open && hasDetail && (
        <div className="px-4 pb-3">
          <pre className="text-[11px] text-muted-foreground bg-[rgba(0,0,0,0.3)] rounded px-3 py-2 whitespace-pre-wrap break-all font-mono leading-relaxed">
            {test.detail}
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ results }: { results: TestResult[] }) {
  const { pass, fail, warn, pending, total } = suiteStats(results)
  return (
    <div className="flex items-center gap-4 flex-wrap text-xs">
      <span className="text-foreground font-bold tabular-nums">{total} tests</span>
      <span className="text-green-400 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />{pass} pass
      </span>
      <span className="text-red-400 flex items-center gap-1">
        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />{fail} fail
      </span>
      {warn > 0 && (
        <span className="text-yellow-400 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />{warn} warn
        </span>
      )}
      {pending > 0 && (
        <span className="text-muted-foreground flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />{pending} pending
        </span>
      )}
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ results }: { results: TestResult[] }) {
  const { pass, fail, warn, total } = suiteStats(results)
  if (total === 0) return null
  const passW  = Math.round((pass / total) * 100)
  const failW  = Math.round((fail / total) * 100)
  const warnW  = Math.round((warn / total) * 100)
  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-secondary flex" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={pass}>
      <div className="bg-green-500/70  transition-all duration-500" style={{ width: `${passW}%` }} />
      <div className="bg-red-500/70    transition-all duration-500" style={{ width: `${failW}%` }} />
      <div className="bg-yellow-500/70 transition-all duration-500" style={{ width: `${warnW}%` }} />
    </div>
  )
}

// ─── Suite Runner card ────────────────────────────────────────────────────────

interface SuiteRunnerProps {
  suiteKey: SuiteKey
  title: string
  description: string
}

export function SuiteRunner({ suiteKey, title, description }: SuiteRunnerProps) {
  const [results, setResults] = useState<TestResult[]>([])
  const [ran, setRan] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<TestStatus | "all">("all")

  const run = useCallback(() => {
    startTransition(() => {
      const r = runSuite(suiteKey)
      setResults(r)
      setRan(true)
    })
  }, [suiteKey])

  const reset = useCallback(() => {
    setResults([])
    setRan(false)
    setFilter("all")
  }, [])

  const visible = filter === "all" ? results : results.filter((r) => r.status === filter)
  const { fail } = suiteStats(results)
  const suiteStatus: TestStatus = !ran ? "pending" : isPending ? "running" : fail > 0 ? "fail" : "pass"

  const FILTERS: Array<TestStatus | "all"> = ["all", "fail", "warn", "pass", "pending"]

  return (
    <section className="glass-card rounded-lg overflow-hidden" aria-label={`${title} test suite`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/25 flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <StatusBadge status={suiteStatus} />
            <h2 className="text-sm font-bold text-foreground">{title}</h2>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {ran && (
            <div className="mt-3 space-y-2">
              <ProgressBar results={results} />
              <StatsBar results={results} />
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {ran && (
            <button
              type="button"
              onClick={reset}
              aria-label="Reset test suite"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border border-border/50 text-muted-foreground rounded hover:text-foreground hover:border-foreground/50 transition-all"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={run}
            disabled={isPending}
            aria-label={`Run ${title} tests`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider btn-led rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? <><Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> Running…</>
              : <><Play className="w-3 h-3" aria-hidden="true" /> {ran ? "Re-run" : "Run Tests"}</>
            }
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      {ran && results.length > 0 && (
        <div className="flex gap-1 px-5 py-2.5 border-b border-border/15 bg-secondary/10 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
                filter === f
                  ? "bg-primary/20 text-foreground border border-primary/40"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/40"
              }`}
            >
              {f === "all" ? `All (${results.length})` : `${f} (${results.filter((r) => r.status === f).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Test rows */}
      {ran && visible.length > 0 && (
        <div role="list" aria-label="Test results">
          {visible.map((test) => (
            <div role="listitem" key={test.id}>
              <TestRow test={test} />
            </div>
          ))}
        </div>
      )}

      {ran && visible.length === 0 && (
        <div className="px-5 py-8 text-center text-xs text-muted-foreground">
          No tests match this filter.
        </div>
      )}

      {!ran && (
        <div className="px-5 py-10 text-center">
          <p className="text-xs text-muted-foreground">Click <strong className="text-foreground">Run Tests</strong> to execute this suite.</p>
        </div>
      )}
    </section>
  )
}
