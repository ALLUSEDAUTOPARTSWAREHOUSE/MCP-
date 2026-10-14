import { NextRequest, NextResponse } from 'next/server'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface RequestBody {
  customerEmail: string
  email?: string
  messages: ConversationMessage[]
  supportEmail?: string
  duration?: number
  timestamp?: string
  htmlContent?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const customerEmail = body.customerEmail || body.email
    const { messages, supportEmail = process.env.SUPPORT_EMAIL || 'support@auapw.com', duration = 0, timestamp } = body

    if (!customerEmail || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Customer email and messages are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const durationMinutes = Math.round(duration / 60)

    // Archive the conversation
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`[CONVERSATION ARCHIVED - ${new Date().toISOString()}]`)
    console.log(`Message ID: ${messageId}`)
    console.log(`Customer Email: ${customerEmail}`)
    console.log(`Duration: ${durationMinutes} minute(s)`)
    console.log(`Message Count: ${messages.length}`)
    console.log(`Support Email: ${supportEmail}`)
    console.log(`${'═'.repeat(60)}`)

    // Format the conversation for logging
    const formattedConversation = messages
      .map((msg, idx) => `\n[${idx + 1}] ${msg.role === 'user' ? 'CUSTOMER' : 'AUAPW BOT'}:\n${msg.content}`)
      .join('\n' + '─'.repeat(60))

    console.log(formattedConversation)
    console.log(`\n${'═'.repeat(60)}\n`)

    // Build HTML email with better formatting
    const conversationHtml = messages
      .map((msg, idx) => {
        const isUser = msg.role === 'user'
        const bgColor = isUser ? '#dbeafe' : '#f3f4f6'
        const textColor = isUser ? '#1e40af' : '#374151'
        const senderLabel = isUser ? 'CUSTOMER' : 'AUAPW BOT'

        return `
        <tr>
          <td style="padding: 14px 16px; background: ${bgColor}; border-radius: 6px; margin-bottom: 8px;">
            <p style="margin: 0 0 6px 0; font-weight: 700; font-size: 12px; color: ${textColor}; text-transform: uppercase; letter-spacing: 0.5px;">
              ${senderLabel}
            </p>
            <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">
              ${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </p>
          </td>
        </tr>
      `
      })
      .join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; background: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 640px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #5a5f68 0%, #3a3f48 100%); color: #ffffff; padding: 28px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
            .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.95; }
            .content { padding: 28px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .details { background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #5a5f68; font-size: 13px; }
            .details-row { margin: 6px 0; }
            .details-label { font-weight: 600; color: #374151; display: inline-block; min-width: 110px; }
            .details-value { color: #6b7280; }
            .conversation { margin: 24px 0; }
            .conversation-title { font-size: 16px; font-weight: 700; color: #1f2937; margin: 0 0 14px 0; }
            table { width: 100%; border-collapse: collapse; }
            table tr { margin-bottom: 8px; }
            .warning-box { background: #fef3c7; padding: 14px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0; font-size: 13px; color: #78350f; }
            .warning-box strong { color: #b45309; }
            .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
            .footer a { color: #5a5f68; text-decoration: none; }
            .cta-button { display: inline-block; padding: 10px 20px; background: #5a5f68; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; margin-top: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Customer Chat Conversation</h1>
              <p>From AUAPW Automotive Chatbot</p>
            </div>
            
            <div class="content">
              <div class="details">
                <div class="details-row">
                  <span class="details-label">Customer Email:</span>
                  <span class="details-value"><strong>${customerEmail}</strong></span>
                </div>
                <div class="details-row">
                  <span class="details-label">Date & Time:</span>
                  <span class="details-value">${new Date(timestamp || Date.now()).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</span>
                </div>
                <div class="details-row">
                  <span class="details-label">Duration:</span>
                  <span class="details-value">${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''}</span>
                </div>
                <div class="details-row">
                  <span class="details-label">Messages:</span>
                  <span class="details-value">${messages.length} message${messages.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div class="conversation">
                <div class="conversation-title">Conversation History</div>
                <table>
                  <tbody>
                    ${conversationHtml}
                  </tbody>
                </table>
              </div>
              
              <div class="warning-box">
                <strong>Action Required:</strong> Please review this conversation and reach out to the customer to provide further support or answer their questions.
              </div>

              <center>
                <a href="mailto:${customerEmail}" class="cta-button">Reply to Customer</a>
              </center>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 6px 0;">© 2024 AUAPW LLC - Quality Used Auto Parts</p>
              <p style="margin: 0;"><a href="https://auapw.com">Visit AUAPW.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    // Try to send with Resend if API key exists
    const resendApiKey = process.env.RESEND_API_KEY
    let emailSent = false

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || 'noreply@auapw.com',
            to: supportEmail,
            replyTo: customerEmail,
            subject: `Customer Chat Conversation - ${customerEmail}`,
            html: emailHtml,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          emailSent = true
          console.log(`[EMAIL SENT] Resend Message ID: ${data.id}`)
        } else {
          const error = await response.text()
          console.error('[RESEND API ERROR]', error)
        }
      } catch (resendError) {
        console.error('[RESEND SEND FAILED]', resendError)
        // Continue anyway, conversation is still archived
      }
    } else {
      console.log('[EMAIL SERVICE] RESEND_API_KEY not configured. Email not sent.')
      console.log('[EMAIL SERVICE] To enable email sending, set RESEND_API_KEY environment variable.')
    }

    return NextResponse.json({
      success: true,
      messageId,
      customerEmail,
      messageCount: messages.length,
      duration: durationMinutes,
      emailSent,
      message: 'Conversation archived successfully. Support team will follow up with the customer soon.',
    })
  } catch (error) {
    console.error('Send conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}
