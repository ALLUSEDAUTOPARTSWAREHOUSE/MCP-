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

async function send(subject: string, html: string, to: string[] = [STAFF_EMAIL], replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[followup] RESEND_API_KEY missing; email not sent (record is saved in admin)")
    return
  }
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    })
    if (error) console.error("[followup] Resend error:", error.message)
  } catch (err) {
    console.error("[followup] Email send failed:", err instanceof Error ? err.message : err)
  }
}

export async function notifyNewChat(
  chat: { conversationId: string; name?: string | null; email?: string | null; pageUrl?: string | null; body: string },
  siteUrl: string,
) {
  const body = `<table style="width:100%;border-collapse:collapse">${rows([
    ["Name", chat.name],
    ["Email", chat.email],
    ["Page", chat.pageUrl],
    ["Message", chat.body],
  ])}</table>`
  await send(
    `New live chat${chat.name ? ` from ${chat.name}` : ""}`,
    shell("New Live Chat", body, `/admin/chats?c=${encodeURIComponent(chat.conversationId)}`, siteUrl),
    [STAFF_EMAIL],
    chat.email || undefined,
  )
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
    [STAFF_EMAIL],
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
    ["Payment", order.paymentGateway ?? "phone"],
    ["Status", order.status],
    ["Total", money(order.totalAmount)],
  ])}</table><h3>Items</h3><ul>${items}</ul>`
  await send(
    `New order ${order.orderNumber} — ${money(order.totalAmount)}`,
    shell("New Order — call to confirm & take payment", body, "/admin/orders", siteUrl),
    [STAFF_EMAIL],
    order.customerEmail || undefined,
  )
}

/**
 * Emails the customer an invoice-style receipt for their own order. Sent
 * on every placed order (pending phone orders and Stripe-paid orders alike)
 * so the customer always has a record of exactly what they entered.
 */
export async function sendCustomerOrderInvoice(order: CustomerOrder, siteUrl: string) {
  if (!order.customerEmail) return

  const items = order.items
    .map(
      (l) =>
        `<li>${escapeHtml(l.name)} × ${l.quantity} — ${money(l.lineTotal)}</li>`,
    )
    .join("")
  const paid = order.status === "paid"
  const reserved = order.status === "reserved_pending_fitment"
  const body = `
    <p>Thanks for your ${reserved ? "reservation" : "order"}, ${escapeHtml(order.customerName) || "there"}! Here is your receipt.</p>
    <table style="width:100%;border-collapse:collapse">${rows([
      ["Order #", order.orderNumber],
      ["Date", new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })],
      ["Ship to", order.shippingAddress],
      ["Phone", order.customerPhone],
      ["Notes", order.customerNotes],
    ])}</table>
    <h3>Items</h3>
    <ul>${items}</ul>
    <table style="width:100%;border-collapse:collapse;margin-top:8px">${rows([
      ["Subtotal", money(order.subtotal)],
      ["Tax", money(order.tax)],
      ["Shipping", money(order.shippingCost)],
      ["Total", money(order.totalAmount)],
    ])}</table>
    <p style="margin-top:16px">
      ${
        paid
          ? `Your card has been charged and your order is confirmed.`
          : reserved
            ? `This part is reserved for you — no payment has been taken. A parts specialist will call you at ${escapeHtml(order.customerPhone)} within one business day to confirm fitment, give you the final price in writing, and take payment only once you approve it. Your warranty coverage is confirmed in writing at that time too.`
            : `No charge has been made yet — a parts specialist will call you at ${escapeHtml(order.customerPhone)} within one business day to confirm fitment and take payment securely by phone.`
      }
    </p>`

  await send(
    `Your AUAPW ${reserved ? "reservation" : "order"} ${order.orderNumber}${paid ? " — paid" : reserved ? " — reserved" : " — received"}`,
    `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0f1117;color:#fff;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">${paid ? "Payment Received" : reserved ? "Part Reserved" : "Order Received"}</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px">
        ${body}
      </div>
    </div>`,
    [order.customerEmail],
  )
}
