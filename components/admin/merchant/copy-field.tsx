"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1 pl-3">
        <code className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">{value}</code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  )
}
