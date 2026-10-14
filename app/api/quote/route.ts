import { NextResponse } from "next/server"
import { notifyQuoteRequest } from '@/lib/notification-dispatcher'
import { v4 as uuid } from 'uuid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { part, make, model, year, option, name, phone, email, state, zip, message } = body

    if (!make || !name || !phone) {
      return NextResponse.json(
        { error: "Make, name, and phone are required." },
        { status: 400 }
      )
    }

    const quoteId = uuid()

    // Send notification via dispatcher
    const notificationResult = await notifyQuoteRequest(quoteId, {
      customerName: name,
      email: email || 'No email provided',
      phone,
      partName: part || 'Auto Part',
      make,
      model: model || 'Not specified',
      year: year || 'Not specified',
      option: option || 'Not specified',
      quantity: 1,
      state: state || 'Not provided',
      zip: zip || 'Not provided',
      notes: message || 'No additional details',
      timestamp: new Date(),
    })

    if (!notificationResult.success) {
      console.warn("[Quote] Notification failed, but continuing:", notificationResult.error)
    }

    return NextResponse.json({
      success: true,
      message: "Your quote request has been sent. We will contact you within 24 hours.",
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process your request. Please try again or call us directly." },
      { status: 500 }
    )
  }
}
