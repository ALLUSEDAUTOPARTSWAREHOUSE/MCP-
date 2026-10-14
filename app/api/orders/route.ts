import { NextResponse } from "next/server"
import { z } from "zod"
import { createOrder } from "@/lib/followup"
import { notifyNewOrder } from "@/lib/followup-notify"
import { priceCart } from "@/lib/order-pricing"

const req = (label: string, max: number) => z.string().trim().min(1, `Please enter your ${label}.`).max(max)

const OrderSchema = z.object({
  customer: z.object({
    firstName: req("first name", 60),
    lastName: req("last name", 60),
    email: z.string().trim().email("Please enter a valid email.").max(200),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number."),
    address: req("street address", 200),
    city: req("city", 80),
    state: req("state", 40),
    zipCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code."),
    notes: z.string().trim().max(1000).optional().default(""),
  }),
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(300),
        make: z.string().max(60).optional(),
        price: z.number().finite(),
        quantity: z.number(),
      }),
    )
    .min(1, "Your cart is empty."),
})

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = OrderSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 })
  }
  const { customer, items } = parsed.data

  const pricing = priceCart(items)
  if (!pricing.ok) return NextResponse.json({ error: pricing.error }, { status: 422 })

  try {
    const order = await createOrder({
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`,
      customerNotes: customer.notes,
      items: pricing.lines,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      shippingCost: pricing.shippingCost,
      totalAmount: pricing.totalAmount,
    })
    await notifyNewOrder(order, new URL(request.url).origin)
    return NextResponse.json({ ok: true, orderNumber: order.orderNumber, totalAmount: order.totalAmount })
  } catch (err) {
    console.error("[orders] Failed to save order:", err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: "We couldn't place your order. Please call us at (708) 896-2383." },
      { status: 500 },
    )
  }
}
