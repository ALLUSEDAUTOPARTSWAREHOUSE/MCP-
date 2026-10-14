/**
 * Email Service for AUAPW Chat Conversations
 * Sends conversation history to support and customer
 */

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface ConversationData {
  customerEmail: string
  messages: ConversationMessage[]
  duration: number
  timestamp: Date
}

/**
 * Generate HTML email format for conversation
 */
function formatConversationHTML(data: ConversationData): string {
  const durationMinutes = Math.round(data.duration / 60)
  
  const messageRows = data.messages
    .map((msg) => {
      const isUser = msg.role === 'user'
      const bgColor = isUser ? '#dbeafe' : '#f3f4f6'
      const senderName = isUser ? 'Customer' : 'AUAPW Bot'
      const senderColor = isUser ? '#1e40af' : '#374151'

      return `
        <tr>
          <td style="padding: 12px 16px; margin-bottom: 8px;">
            <p style="margin: 0 0 6px 0; font-weight: 600; font-size: 12px; color: ${senderColor}; text-transform: uppercase; letter-spacing: 0.5px;">
              ${senderName}
            </p>
            <div style="background-color: ${bgColor}; padding: 12px; border-radius: 6px; font-size: 14px; line-height: 1.5; color: #1f2937;">
              ${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}
            </div>
          </td>
        </tr>
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; color: #1f2937; background-color: #f9fafb; }
      .container { max-width: 640px; margin: 0 auto; background: #ffffff; }
      .header { background: linear-gradient(135deg, #5a5f68 0%, #3a3f48 100%); color: #ffffff; padding: 24px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
      .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.95; }
      .content { padding: 24px; }
      .details { background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
      .details-row { margin: 8px 0; }
      .details-label { font-weight: 600; color: #374151; display: inline-block; min-width: 120px; }
      .details-value { color: #6b7280; }
      .conversation { margin: 20px 0; }
      .conversation-title { font-size: 16px; font-weight: 700; color: #1f2937; margin-bottom: 16px; }
      .message-table { width: 100%; border-collapse: collapse; }
      .footer { background: #f9fafb; padding: 16px 24px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
      .cta-button { display: inline-block; background: #3a3f48; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 12px; }
      .badge { display: inline-block; background: #e0e7ff; color: #4f46e5; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Chat Conversation Summary</h1>
        <p>From AUAPW Automotive Chatbot</p>
      </div>
      
      <div class="content">
        <div class="details">
          <div class="details-row">
            <span class="details-label">Customer Email:</span>
            <span class="details-value"><strong>${data.customerEmail}</strong></span>
          </div>
          <div class="details-row">
            <span class="details-label">Date & Time:</span>
            <span class="details-value">${data.timestamp.toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Duration:</span>
            <span class="details-value">${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''}</span>
          </div>
          <div class="details-row">
            <span class="details-label">Message Count:</span>
            <span class="details-value">${data.messages.length} messages</span>
          </div>
        </div>

        <div class="conversation">
          <div class="conversation-title">Conversation History</div>
          <table class="message-table">
            <tbody>
              ${messageRows}
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 20px 0; font-size: 13px; color: #78350f;">
          <strong>Action Required:</strong> Please reach out to the customer to continue providing support and addressing their questions.
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0;">This conversation was captured through the AUAPW Automotive Chatbot.<br>
        Reply to this email to contact the customer at <strong>${data.customerEmail}</strong></p>
      </div>
    </div>
  </body>
</html>`
}

/**
 * Send conversation to support email
 */
export async function sendConversationToSupport(
  customerEmail: string,
  messages: ConversationMessage[],
  startTime: Date,
  endTime: Date,
  supportEmail: string = process.env.SUPPORT_EMAIL || 'support@auapw.com'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
    
    const conversationData: ConversationData = {
      customerEmail,
      messages,
      duration,
      timestamp: endTime,
    }

    const htmlContent = formatConversationHTML(conversationData)

    // Call the send-conversation API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerEmail,
        messages,
        duration,
        timestamp: endTime.toISOString(),
        supportEmail,
        htmlContent,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to send email' }
    }

    const data = await response.json()
    return { success: true, messageId: data.messageId }
  } catch (error) {
    console.error('[CHAT EMAIL ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
