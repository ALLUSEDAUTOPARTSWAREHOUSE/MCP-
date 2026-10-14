import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { notificationSettings } from '@/lib/db/schema'

const DEFAULT_NOTIFICATION_TYPES = [
  {
    eventType: 'userSignup',
    subject: 'Welcome to AUAPW - Verify Your Email',
    description: 'Sent when a new user signs up',
  },
  {
    eventType: 'emailVerified',
    subject: 'Email Verified - Welcome!',
    description: 'Sent when user verifies their email',
  },
  {
    eventType: 'newOrder',
    subject: 'New Order Received - {orderNumber}',
    description: 'Admin notified of new customer order',
  },
  {
    eventType: 'paymentSuccess',
    subject: 'Payment Received for Order {orderNumber}',
    description: 'Customer notified of successful payment',
  },
  {
    eventType: 'paymentFailure',
    subject: 'Payment Failed - Action Required',
    description: 'Customer notified of payment failure',
  },
  {
    eventType: 'shipmentNotification',
    subject: 'Your Order Has Shipped - Tracking {trackingNumber}',
    description: 'Customer notified when order ships',
  },
  {
    eventType: 'contactForm',
    subject: 'New Contact Form Submission',
    description: 'Admin notified of new contact message',
  },
  {
    eventType: 'quoteRequest',
    subject: 'Quote Request Received',
    description: 'Admin notified of new quote request',
  },
]

export async function POST(req: NextRequest) {
  try {
    const adminEmails = ['auapworld@gmail.com', 'sale@auapw.com']

    for (const notifType of DEFAULT_NOTIFICATION_TYPES) {
      // Check if already exists
      const existing = await db
        .select()
        .from(notificationSettings)
        .where(undefined)
        .then(settings => settings.find(s => s.eventType === notifType.eventType))

      if (!existing) {
        await db.insert(notificationSettings).values({
          id: `notif-${notifType.eventType}`,
          eventType: notifType.eventType,
          enabled: true,
          recipients: adminEmails,
          subject: notifType.subject,
          description: notifType.description,
        })
      }
    }

    return NextResponse.json(
      { message: 'Notification types initialized' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Notification init error:', error)
    return NextResponse.json(
      { error: 'Initialization failed' },
      { status: 500 }
    )
  }
}
