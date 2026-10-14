"use server"

import { revalidatePath } from "next/cache"
import { getAdminSession } from "@/lib/admin-auth"
import {
  ORDER_STATUSES,
  QUOTE_STATUSES,
  updateOrder,
  updateQuoteLead,
  type OrderStatus,
  type QuoteStatus,
} from "@/lib/followup"

export interface FollowupActionState {
  ok: boolean
  message: string
}

const notes = (v: FormDataEntryValue | null) => String(v ?? "").trim().slice(0, 4000)

export async function saveQuoteFollowup(
  _prev: FollowupActionState,
  formData: FormData,
): Promise<FollowupActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }

  const id = Number(formData.get("id"))
  const status = String(formData.get("status")) as QuoteStatus
  const rawAmount = String(formData.get("quoteAmount") ?? "").trim()
  const quoteAmount = rawAmount === "" ? null : Number(rawAmount)

  if (!Number.isInteger(id) || id < 1) return { ok: false, message: "Invalid quote." }
  if (!QUOTE_STATUSES.includes(status)) return { ok: false, message: "Invalid status." }
  if (quoteAmount !== null && (!Number.isFinite(quoteAmount) || quoteAmount < 0 || quoteAmount > 1_000_000)) {
    return { ok: false, message: "Quote amount must be a positive number." }
  }

  await updateQuoteLead(id, { status, internalNotes: notes(formData.get("internalNotes")), quoteAmount })
  revalidatePath("/admin/quotes")
  revalidatePath("/admin/dashboard")
  return { ok: true, message: "Saved" }
}

export async function saveOrderFollowup(
  _prev: FollowupActionState,
  formData: FormData,
): Promise<FollowupActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status")) as OrderStatus
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, message: "Invalid order." }
  if (!ORDER_STATUSES.includes(status)) return { ok: false, message: "Invalid status." }

  await updateOrder(id, { status, internalNotes: notes(formData.get("internalNotes")) })
  revalidatePath("/admin/orders")
  revalidatePath("/admin/dashboard")
  return { ok: true, message: "Saved" }
}
