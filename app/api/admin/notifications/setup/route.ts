import { db } from '@/lib/db'
import { notificationSettings } from '@/lib/db/schema'
import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { eq } from 'drizzle-orm'

// Default recipients for all notifications
const DEFAULT_RECIPIENTS = ['auapworld@gmail.com', 'sale@auapw.com']

// Event type configurations
const EVENT_CONFIGS = {
  newCustomer: {
    subject: '🎉 New Customer Registration - AUAPW',
    description: 'Notified when a new customer registers',
  },
  newOrder: {
    subject: '📦 New Order Received - AUAPW',
    description: 'Notified when a new order is placed',
  },
  paymentSuccess: {
    subject: '✅ Payment Received',
    description: 'Notified when payment is successfully processed',
  },
  paymentFailure: {
    subject: '⚠️ Payment Failed',
    description: 'Notified when a payment attempt fails',
  },
  highRiskOrder: {
    subject: '⚠️ High Risk Order Alert',
    description: 'Notified when a high-risk order is detected',
  },
  chargeback: {
    subject: '🚨 Chargeback Alert',
    description: 'Notified when a chargeback is filed',
  },
  refund: {
    subject: '💰 Refund Processed',
    description: 'Notified when a refund is issued',
  },
  contactForm: {
    subject: '📨 New Contact Form Submission',
    description: 'Notified when a customer submits a contact form',
  },
  quoteRequest: {
    subject: '💼 New Quote Request',
    description: 'Notified when a customer requests a quote',
  },
  ticketCreated: {
    subject: '🎫 New Support Ticket',
    description: 'Notified when a new support ticket is created',
  },
  shipmentNotification: {
    subject: '📮 Shipment Update',
    description: 'Notified when a shipment status changes',
  },
  dailyReport: {
    subject: '📊 Daily Report',
    description: 'Daily business report sent each morning',
  },
  weeklyReport: {
    subject: '📊 Weekly Report',
    description: 'Weekly business report sent each Monday',
  },
  aiChatEscalation: {
    subject: '🤖 AI Chat Escalation',
    description: 'Notified when an AI chat needs human assistance',
  },
}

/**
 * Initialize notification settings with default configurations
 * Call this once to bootstrap the notification system
 * 
 * Usage: POST /api/admin/notifications/setup
 */
export async function POST() {
  try {
    // Check if settings already exist
    const existing = await db.select().from(notificationSettings)
    
    if (existing.length > 0) {
      return NextResponse.json(
        {
          message: 'Notification settings already initialized',
          count: existing.length,
          settings: existing,
        },
        { status: 200 }
      )
    }

    // Create default settings for all event types
    const settings = []
    for (const [eventType, config] of Object.entries(EVENT_CONFIGS)) {
      settings.push({
        id: uuid(),
        eventType,
        enabled: true,
        recipients: DEFAULT_RECIPIENTS,
        subject: config.subject,
        description: config.description,
      })
    }

    // Insert all settings
    await db.insert(notificationSettings).values(settings)

    return NextResponse.json(
      {
        message: 'Notification settings initialized successfully',
        count: settings.length,
        settings,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[NotificationSetup] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to initialize notification settings',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

/**
 * Reset notification settings to defaults
 * 
 * Usage: DELETE /api/admin/notifications/setup
 */
export async function DELETE() {
  try {
    // Delete all existing settings
    const existing = await db.select().from(notificationSettings)
    
    for (const setting of existing) {
      await db.delete(notificationSettings).where(eq(notificationSettings.id, setting.id))
    }

    // Re-initialize with defaults
    return POST()
  } catch (error) {
    console.error('[NotificationSetup] Reset error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to reset notification settings',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
