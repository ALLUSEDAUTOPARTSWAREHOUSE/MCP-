import nodemailer from 'nodemailer'

// Email templates for different notification types
const emailTemplates: Record<string, (data: any) => { subject: string; html: string }> = {
  newCustomer: (data) => ({
    subject: '🎉 New Customer Registration - AUAPW',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">New Customer Registration</h2>
          <p style="color: #666; line-height: 1.6;">A new customer has joined AUAPW:</p>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>Name:</strong> ${data.customerName || 'N/A'}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li><strong>Registered:</strong> ${new Date(data.createdAt).toLocaleString()}</li>
          </ul>
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            This is an automated notification from AUAPW LLC.
          </p>
        </div>
      </div>
    `,
  }),

  newOrder: (data) => ({
    subject: `📦 New Order #${data.orderId} - AUAPW`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">New Order Received</h2>
          <p style="color: #666; line-height: 1.6;">A new order has been placed:</p>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>Order ID:</strong> ${data.orderId}</li>
            <li><strong>Customer:</strong> ${data.customerName}</li>
            <li><strong>Total:</strong> $${parseFloat(data.total).toFixed(2)}</li>
            <li><strong>Items:</strong> ${data.itemCount} item${data.itemCount !== 1 ? 's' : ''}</li>
            <li><strong>Timestamp:</strong> ${new Date(data.createdAt).toLocaleString()}</li>
          </ul>
          <a href="${process.env.SITE_URL}/admin/orders/${data.orderId}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px;">View Order</a>
        </div>
      </div>
    `,
  }),

  paymentSuccess: (data) => ({
    subject: `✅ Payment Confirmed - Order #${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #22c55e; margin-bottom: 20px;">✅ Payment Received</h2>
          <p style="color: #666; line-height: 1.6;">Payment has been successfully processed:</p>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>Order ID:</strong> ${data.orderId}</li>
            <li><strong>Amount:</strong> $${parseFloat(data.amount).toFixed(2)}</li>
            <li><strong>Method:</strong> ${data.paymentMethod}</li>
            <li><strong>Transaction ID:</strong> ${data.transactionId}</li>
          </ul>
        </div>
      </div>
    `,
  }),

  paymentFailure: (data) => ({
    subject: `⚠️ Payment Failed - Order #${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #ef4444; margin-bottom: 20px;">⚠️ Payment Failed</h2>
          <p style="color: #666; line-height: 1.6;">A payment attempt failed:</p>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>Order ID:</strong> ${data.orderId}</li>
            <li><strong>Amount:</strong> $${parseFloat(data.amount).toFixed(2)}</li>
            <li><strong>Reason:</strong> ${data.reason}</li>
            <li><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</li>
          </ul>
          <p style="color: #ef4444; margin-top: 15px;">⚠️ Action required - contact customer to retry payment.</p>
        </div>
      </div>
    `,
  }),

  contactForm: (data) => ({
    subject: `📨 New Contact Form Submission - ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li><strong>Subject:</strong> ${data.subject}</li>
          </ul>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2563eb; margin-top: 20px;">
            <p style="color: #666; white-space: pre-wrap; word-wrap: break-word;">${data.message}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Submitted at: ${new Date(data.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `,
  }),

  quoteRequest: (data) => ({
    subject: `💼 New Quote Request - ${data.partName || 'Parts'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">New Quote Request</h2>
          <ul style="color: #666; line-height: 1.8;">
            <li><strong>Customer:</strong> ${data.customerName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
            <li><strong>Part/Service:</strong> ${data.partName || 'N/A'}</li>
            <li><strong>Quantity:</strong> ${data.quantity || 'N/A'}</li>
          </ul>
          <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #06b6d4; margin-top: 20px;">
            <p style="color: #666;"><strong>Notes:</strong></p>
            <p style="color: #666; white-space: pre-wrap; word-wrap: break-word;">${data.notes || 'No additional notes'}</p>
          </div>
        </div>
      </div>
    `,
  }),

  dailyReport: (data) => ({
    subject: `📊 Daily Report - ${new Date(data.date).toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">📊 Daily Report</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>New Orders</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${data.newOrders || 0}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Revenue</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${parseFloat(data.totalRevenue || 0).toFixed(2)}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>New Customers</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${data.newCustomers || 0}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Support Tickets</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${data.supportTickets || 0}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  }),
}

// Create email transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

interface SendEmailOptions {
  to: string | string[]
  eventType: keyof typeof emailTemplates
  data: any
  referenceId?: string
  referenceType?: string
}

// Main email sending function with retry logic and logging
export async function sendEmail(options: SendEmailOptions) {
  const { to, eventType, data, referenceId, referenceType } = options
  const recipients = Array.isArray(to) ? to : [to]

  try {
    // Get template
    const template = emailTemplates[eventType]
    if (!template) {
      throw new Error(`Email template not found for event type: ${eventType}`)
    }

    const { subject, html } = template(data)

    // Send email
    const transporter = getTransporter()
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || 'noreply@auapw.com',
      to: recipients.join(','),
      subject,
      html,
    })

    console.log(`[Email] Sent to ${recipients.join(', ')} - Message ID: ${info.messageId}`)

    // Log to database (async, fire-and-forget)
    logNotification({
      eventType,
      recipients,
      subject,
      status: 'sent',
      referenceId,
      referenceType,
      metadata: { messageId: info.messageId, response: info.response },
    }).catch((err) => console.error('[Email] Logging failed:', err))

    return { success: true, messageId: info.messageId }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Email] Failed to send to ${recipients.join(', ')}:`, errorMessage)

    // Log failure to database
    logNotification({
      eventType,
      recipients,
      subject: `${eventType} notification`,
      status: 'failed',
      failureReason: errorMessage,
      referenceId,
      referenceType,
    }).catch((err) => console.error('[Email] Logging failed:', err))

    return { success: false, error: errorMessage }
  }
}

// Helper to log notifications to database
async function logNotification(data: {
  eventType: string
  recipients: string[]
  subject: string
  status: 'pending' | 'sent' | 'failed'
  failureReason?: string
  referenceId?: string
  referenceType?: string
  metadata?: any
}) {
  try {
    const { db } = await import('./db')
    const { notificationLogs } = await import('./db/schema')
    const { v4: uuid } = await import('uuid')

    await db.insert(notificationLogs).values({
      id: uuid(),
      eventType: data.eventType,
      recipients: data.recipients,
      subject: data.subject,
      status: data.status,
      failureReason: data.failureReason,
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      metadata: data.metadata,
      attemptCount: 1,
      lastAttemptAt: new Date(),
    })
  } catch (error) {
    console.error('[NotificationLog] Failed to log:', error)
  }
}

export { emailTemplates }
