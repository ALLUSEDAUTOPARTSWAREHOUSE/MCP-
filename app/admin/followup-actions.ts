"use server"

import { revalidatePath } from "next/cache"
import { getAdminSession } from "@/lib/admin-auth"
import {
  ORDER_STATUSES,
  QUOTE_STATUSES,
  getOrderById,
  getQuoteLeadById,
  updateOrder,
  updateQuoteLead,
  type OrderStatus,
  type QuoteStatus,
} from "@/lib/followup"
import { sendOrderStatusEmail, sendQuoteEmail } from "@/lib/followup-notify"
import { SITE_URL } from "@/lib/merchant"

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
  const emailQuote = formData.get("emailQuote") === "on"

  if (!Number.isInteger(id) || id < 1) return { ok: false, message: "Invalid quote." }
  if (!QUOTE_STATUSES.includes(status)) return { ok: false, message: "Invalid status." }
  if (quoteAmount !== null && (!Number.isFinite(quoteAmount) || quoteAmount < 0 || quoteAmount > 1_000_000)) {
    return { ok: false, message: "Quote amount must be a positive number." }
  }
  if (emailQuote && !(quoteAmount && quoteAmount > 0)) {
    return { ok: false, message: "Enter the quoted price before emailing the quote." }
  }

  await updateQuoteLead(id, { status, internalNotes: notes(formData.get("internalNotes")), quoteAmount })
  revalidatePath("/admin/quotes")
  revalidatePath("/admin/dashboard")

  if (!emailQuote) return { ok: true, message: "Saved" }
  const lead = await getQuoteLeadById(id)
  if (!lead) return { ok: false, message: "Saved, but the quote request could not be reloaded to email it." }
  const sent = await sendQuoteEmail(lead, quoteAmount!, notes(formData.get("customerMessage")).slice(0, 1000), SITE_URL)
  return sent.ok
    ? { ok: true, message: `Saved · quote emailed to ${lead.email}` }
    : { ok: false, message: `Saved, but the email was not sent: ${sent.error}` }
}

export async function saveOrderFollowup(
  _prev: FollowupActionState,
  formData: FormData,
): Promise<FollowupActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status")) as OrderStatus
  const emailCustomer = formData.get("emailCustomer") === "on"
  // Ids are UUIDs for new orders, but older orders may use other formats; the
  // value only ever reaches a parameterized query.
  if (!/^[\w-]{1,64}$/.test(id)) return { ok: false, message: "Invalid order." }
  if (!ORDER_STATUSES.includes(status)) return { ok: false, message: "Invalid status." }

  await updateOrder(id, { status, internalNotes: notes(formData.get("internalNotes")) })
  revalidatePath("/admin/orders")
  revalidatePath("/admin/dashboard")

  if (!emailCustomer) return { ok: true, message: "Saved" }
  const order = await getOrderById(id)
  if (!order) return { ok: false, message: "Saved, but the order could not be reloaded to email the customer." }
  const sent = await sendOrderStatusEmail(order, notes(formData.get("customerMessage")).slice(0, 1000), SITE_URL)
  return sent.ok
    ? { ok: true, message: `Saved · customer emailed at ${order.customerEmail}` }
    : { ok: false, message: `Saved, but the email was not sent: ${sent.error}` }
}
