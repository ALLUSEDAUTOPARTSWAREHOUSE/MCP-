import "server-only"
import { Resend } from "resend"
import type { CustomerOrder, QuoteLead } from "@/lib/followup"

const STAFF_EMAIL = process.env.FOLLOWUP_EMAIL || "auapworld@gmail.com"
const FROM =
  process.env.EMAIL_FROM ||
  (process.env.RESEND_EMAIL_DOMAIN
    ? `AUAPW Website <notifications@${process.env.RESEND_EMAIL_DOMAIN}>`
    : "AUAPW Website <onboarding@resend.dev>")

const escapeHtml = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function rows(pairs: [string, unknown][]) {
  return pairs
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#6b7280;width:120px">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:bold">${escapeHtml(v || "—")}</td></tr>`,
    )
    .join("")
}

function shell(title: string, body: string, adminPath: string, siteUrl: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#0f1117;color:#fff;padding:20px;border-radius:8px 8px 0 0">
      <h2 style="margin:0">${escapeHtml(title)}</h2>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px">
      ${body}
      <p style="margin-top:20px"><a href="${escapeHtml(siteUrl + adminPath)}" style="background:#f59e0b;color:#0f1117;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Open in admin</a></p>
    </div>
  </div>`
}

async function send(subject: string, html: string, replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[followup] RESEND_API_KEY missing; staff alert not emailed (record is saved in admin)")
    return
  }
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: [STAFF_EMAIL],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    })
    if (error) console.error("[followup] Resend error:", error.message)
  } catch (err) {
    console.error("[followup] Staff alert failed:", err instanceof Error ? err.message : err)
  }
}

export async function notifyNewQuote(lead: QuoteLead, siteUrl: string) {
  const vehicle = [lead.year, lead.make, lead.model].filter(Boolean).join(" ")
  const body = `<table style="width:100%;border-collapse:collapse">${rows([
    ["Quote #", lead.id],
    ["Part", lead.partType],
    ["Vehicle", vehicle],
    ["Option", lead.partOption],
    ["Name", lead.fullName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["State / ZIP", [lead.state, lead.zip].filter(Boolean).join(" ")],
    ["Notes", lead.notes],
    ["Source", lead.source],
  ])}</table>`
  await send(
    `New quote #${lead.id}: ${vehicle || lead.make} ${lead.partType}`.trim(),
    shell("New Quote Request", body, "/admin/quotes", siteUrl),
    lead.email || undefined,
  )
}

export async function notifyNewOrder(order: CustomerOrder, siteUrl: string) {
  const items = order.items
    .map((l) => `<li>${escapeHtml(l.name)} × ${l.quantity} — ${money(l.lineTotal)}</li>`)
    .join("")
  const body = `<table style="width:100%;border-collapse:collapse">${rows([
    ["Order #", order.orderNumber],
    ["Name", order.customerName],
    ["Phone", order.customerPhone],
    ["Email", order.customerEmail],
    ["Ship to", order.shippingAddress],
    ["Notes", order.customerNotes],
    ["Total", money(order.totalAmount)],
  ])}</table><h3>Items</h3><ul>${items}</ul>`
  await send(
    `New order ${order.orderNumber} — ${money(order.totalAmount)}`,
    shell("New Order — call to confirm & take payment", body, "/admin/orders", siteUrl),
    order.customerEmail || undefined,
  )
}
