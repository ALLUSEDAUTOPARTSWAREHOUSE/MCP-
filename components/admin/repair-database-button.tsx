"use client"

import { useActionState } from "react"
import { Wrench } from "lucide-react"
import { repairDatabaseAction, type RepairState } from "@/app/admin/settings/actions"

const initial: RepairState = { ok: false, message: "" }

export function RepairDatabaseButton() {
  const [state, action, pending] = useActionState(repairDatabaseAction, initial)
  return (
    <form action={action} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        <Wrench className="h-4 w-4" aria-hidden="true" />
        {pending ? "Repairing…" : "Add missing tables and columns"}
      </button>
      <p role="status" className={`text-xs ${state.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
        {pending ? "" : state.message}
      </p>
    </form>
  )
}
