import { sendEmail } from './email-service'
import { db } from './db'
import { notificationSettings } from './db/schema'
import { eq } from 'drizzle-orm'

// 14 notification event types
export type NotificationEventType =
  | 'newCustomer'
  | 'newOrder'
  | 'paymentSuccess'
  | 'paymentFailure'
  | 'highRiskOrder'
  | 'chargeback'
  | 'refund'
  | 'contactForm'
  | 'quoteRequest'
  | 'ticketCreated'
  | 'shipmentNotification'
  | 'dailyReport'
  | 'weeklyReport'
  | 'aiChatEscalation'

interface NotificationPayload {
  eventType: NotificationEventType
  referenceId?: string
  referenceType?: string
  data: Record<string, any>
}

/**
 * Central dispatcher for all notifications
 * Checks if notification type is enabled, retrieves recipients, sends email
 */
export async function dispatchNotification(payload: NotificationPayload) {
  const { eventType, referenceId, referenceType, data } = payload

  try {
    // Get notification settings for this event type
    const setting = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.eventType, eventType))
      .limit(1)

    if (!setting || setting.length === 0) {
      console.warn(`[Dispatcher] No settings found for event type: ${eventType}`)
      return { success: false, error: 'Event type not configured' }
    }

    const { enabled, recipients: recipientsJson } = setting[0]

    // Check if notifications are enabled for this event type
    if (!enabled) {
      console.log(`[Dispatcher] Notifications disabled for event type: ${eventType}`)
      return { success: false, error: 'Notifications disabled for this event type' }
    }

    // Parse recipients
    let recipients: string[] = []
    try {
      recipients = Array.isArray(recipientsJson) ? recipientsJson : JSON.parse(recipientsJson as any)
    } catch {
      console.error(`[Dispatcher] Failed to parse recipients for ${eventType}`)
      return { success: false, error: 'Invalid recipients configuration' }
    }

    if (recipients.length === 0) {
      console.warn(`[Dispatcher] No recipients configured for event type: ${eventType}`)
      return { success: false, error: 'No recipients configured' }
    }

    // Send email
    const result = await sendEmail({
      to: recipients,
      eventType: eventType as keyof typeof import('./email-service').emailTemplates,
      data,
      referenceId,
      referenceType,
    })

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Dispatcher] Error dispatching ${eventType}:`, errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Convenience functions for each event type
 */

export async function notifyNewCustomer(customerId: string, customerData: any) {
  return dispatchNotification({
    eventType: 'newCustomer',
    referenceId: customerId,
    referenceType: 'customer',
    data: customerData,
  })
}

export async function notifyNewOrder(orderId: string, orderData: any) {
  return dispatchNotification({
    eventType: 'newOrder',
    referenceId: orderId,
    referenceType: 'order',
    data: orderData,
  })
}

export async function notifyPaymentSuccess(orderId: string, paymentData: any) {
  return dispatchNotification({
    eventType: 'paymentSuccess',
    referenceId: orderId,
    referenceType: 'payment',
    data: paymentData,
  })
}

export async function notifyPaymentFailure(orderId: string, paymentData: any) {
  return dispatchNotification({
    eventType: 'paymentFailure',
    referenceId: orderId,
    referenceType: 'payment',
    data: paymentData,
  })
}

export async function notifyHighRiskOrder(orderId: string, riskData: any) {
  return dispatchNotification({
    eventType: 'highRiskOrder',
    referenceId: orderId,
    referenceType: 'order',
    data: riskData,
  })
}

export async function notifyChargeback(chargebackId: string, chargebackData: any) {
  return dispatchNotification({
    eventType: 'chargeback',
    referenceId: chargebackId,
    referenceType: 'chargeback',
    data: chargebackData,
  })
}

export async function notifyRefund(orderId: string, refundData: any) {
  return dispatchNotification({
    eventType: 'refund',
    referenceId: orderId,
    referenceType: 'refund',
    data: refundData,
  })
}

export async function notifyContactForm(contactId: string, contactData: any) {
  return dispatchNotification({
    eventType: 'contactForm',
    referenceId: contactId,
    referenceType: 'contact',
    data: contactData,
  })
}

export async function notifyQuoteRequest(quoteId: string, quoteData: any) {
  return dispatchNotification({
    eventType: 'quoteRequest',
    referenceId: quoteId,
    referenceType: 'quote',
    data: quoteData,
  })
}

export async function notifyTicketCreated(ticketId: string, ticketData: any) {
  return dispatchNotification({
    eventType: 'ticketCreated',
    referenceId: ticketId,
    referenceType: 'ticket',
    data: ticketData,
  })
}

export async function notifyShipment(shipmentId: string, shipmentData: any) {
  return dispatchNotification({
    eventType: 'shipmentNotification',
    referenceId: shipmentId,
    referenceType: 'shipment',
    data: shipmentData,
  })
}

export async function sendDailyReport(reportData: any) {
  return dispatchNotification({
    eventType: 'dailyReport',
    referenceType: 'report',
    data: reportData,
  })
}

export async function sendWeeklyReport(reportData: any) {
  return dispatchNotification({
    eventType: 'weeklyReport',
    referenceType: 'report',
    data: reportData,
  })
}

export async function notifyAIChatEscalation(escalationId: string, escalationData: any) {
  return dispatchNotification({
    eventType: 'aiChatEscalation',
    referenceId: escalationId,
    referenceType: 'escalation',
    data: escalationData,
  })
}
