# Notification System Setup Guide

## Overview

The AUAPW notification system provides:
- Real-time email notifications for 14 event types
- HTML email templates with professional branding
- Database logging of all notification attempts
- Admin dashboard to manage notification settings
- Google Maps address autocomplete for quote/checkout flows
- Retry logic and delivery confirmation

## Quick Start

### 1. Environment Variables

Add these to your `.env.local` or Vercel project settings:

```env
# Email (SMTP) - Example using Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@auapw.com
SITE_URL=https://yourdomain.com

# Google Maps (for address autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**Gmail Setup:**
1. Enable 2FA on your Gmail account
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the 16-character app password in `SMTP_PASS`

**Google Maps Setup:**
1. Create a project in Google Cloud Console
2. Enable Places API and Maps JavaScript API
3. Create an API key with restrictions

### 2. Initialize Notification Settings

Make a POST request to bootstrap the system:

```bash
curl -X POST http://localhost:3000/api/admin/notifications/setup
```

This creates default settings for all 14 event types with recipients: `auapworld@gmail.com, sale@auapw.com`

### 3. Install Dependencies

The notification system requires `nodemailer`:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer

# Also ensure uuid and lucide-react are installed (should be already)
npm install uuid lucide-react
```

## 14 Event Types

| Event Type | Trigger | Recipients |
|---|---|---|
| **newCustomer** | User registration | Admin |
| **newOrder** | Order placed | Admin |
| **paymentSuccess** | Payment processed | Admin |
| **paymentFailure** | Payment failed | Admin |
| **highRiskOrder** | Fraud alert | Admin |
| **chargeback** | Chargeback filed | Admin |
| **refund** | Refund issued | Admin |
| **contactForm** | Contact form submitted | Admin |
| **quoteRequest** | Quote requested | Admin |
| **ticketCreated** | Support ticket opened | Admin |
| **shipmentNotification** | Shipment status update | Admin |
| **dailyReport** | Scheduled (daily) | Admin |
| **weeklyReport** | Scheduled (weekly) | Admin |
| **aiChatEscalation** | AI needs help | Admin |

## Database Schema

### `notificationSettings` table
- `id`: Unique identifier
- `eventType`: Type of notification (e.g., "newOrder")
- `enabled`: Boolean to enable/disable notifications
- `recipients`: JSON array of email addresses
- `subject`: Email subject line
- `description`: Description of when this notification fires
- `createdAt`, `updatedAt`: Timestamps

### `notificationLogs` table
- `id`: Unique identifier
- `eventType`: Type of notification
- `recipients`: JSON array of recipients who received it
- `subject`: Email subject line
- `status`: "pending", "sent", or "failed"
- `failureReason`: Error message if failed
- `referenceId`: Order ID, user ID, etc.
- `referenceType`: Type of reference (order, user, payment, etc.)
- `metadata`: JSON for additional data (messageId, response, etc.)
- `attemptCount`: Number of send attempts
- `lastAttemptAt`: Last attempt timestamp
- `createdAt`, `updatedAt`: Timestamps

## API Routes

### Settings Management

**GET /api/admin/notifications/settings**
- Returns all notification settings

**PUT /api/admin/notifications/settings**
- Update settings for an event type
- Body: `{ eventType, enabled, recipients, subject, description }`

### Logs & Monitoring

**GET /api/admin/notifications/logs**
- Query params: `eventType`, `status`, `limit`, `offset`
- Returns paginated notification logs

**DELETE /api/admin/notifications/logs**
- Delete logs older than N days
- Body: `{ daysOld: 30 }`

### Setup

**POST /api/admin/notifications/setup**
- Initialize all 14 event types with defaults

**DELETE /api/admin/notifications/setup**
- Reset all settings to defaults

## Usage Examples

### Wire into Order Creation

```typescript
import { notifyNewOrder } from '@/lib/notification-dispatcher'

// After order is created
await notifyNewOrder(orderId, {
  orderId,
  orderNumber,
  customerName: user.name,
  email: user.email,
  itemCount: items.length,
  total: totalAmount,
  createdAt: new Date(),
})
```

### Wire into Quote Requests

```typescript
import { notifyQuoteRequest } from '@/lib/notification-dispatcher'

await notifyQuoteRequest(quoteId, {
  customerName: name,
  email,
  phone,
  partName: part,
  make,
  model,
  quantity,
  notes: message,
  timestamp: new Date(),
})
```

### Wire into Payment Events

```typescript
import { notifyPaymentSuccess, notifyPaymentFailure } from '@/lib/notification-dispatcher'

// On success
await notifyPaymentSuccess(orderId, {
  orderId,
  amount,
  paymentMethod,
  transactionId,
})

// On failure
await notifyPaymentFailure(orderId, {
  orderId,
  amount,
  reason: 'Declined by issuer',
  timestamp: new Date(),
})
```

### Wire into Contact Forms

```typescript
import { notifyContactForm } from '@/lib/notification-dispatcher'

await notifyContactForm(contactId, {
  name,
  email,
  phone,
  subject,
  message,
  timestamp: new Date(),
})
```

## Admin Dashboard

Visit `/admin/notifications` (you'll need to create/protect this route) to:
- **Settings tab**: Enable/disable events, manage recipients
- **Logs tab**: View delivery status, timestamps, and failure reasons

Component: `components/admin/notification-dashboard.tsx`

## Google Places Address Autocomplete

Use the component in checkout or quote forms:

```tsx
import { GooglePlacesInput } from '@/components/google-places-input'

export function AddressField() {
  const [address, setAddress] = useState('')
  const [parsedAddress, setParsedAddress] = useState(null)

  return (
    <GooglePlacesInput
      value={address}
      onChange={setAddress}
      onAddressSelect={setParsedAddress}
      placeholder="Enter your address..."
    />
  )
}
```

Callback returns:
```typescript
{
  formatted: "123 Main St, New York, NY 10001, USA",
  street: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  country: "US",
  lat: 40.7128,
  lng: -74.0060
}
```

## Testing

### Test Email Sending

```bash
# Initialize settings first
curl -X POST http://localhost:3000/api/admin/notifications/setup

# Trigger a test notification from the codebase
# Call any notifier function with test data
```

### View Logs

```bash
# Get all logs
curl http://localhost:3000/api/admin/notifications/logs

# Filter by status
curl http://localhost:3000/api/admin/notifications/logs?status=sent

# Filter by event type
curl http://localhost:3000/api/admin/notifications/logs?eventType=newOrder
```

### Update Settings

```bash
curl -X PUT http://localhost:3000/api/admin/notifications/settings \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "newOrder",
    "enabled": true,
    "recipients": ["newemail@example.com"],
    "subject": "New Order - Custom Subject"
  }'
```

## Troubleshooting

### Emails Not Sending

1. Check env vars are set: `echo $SMTP_HOST`
2. Verify Gmail app password (not your regular password)
3. Check notification is enabled: GET `/api/admin/notifications/settings`
4. Check logs: GET `/api/admin/notifications/logs?status=failed`
5. Enable "Less secure app access" if using standard Gmail password

### Google Maps Not Working

1. Verify API key: Check Google Cloud Console
2. Verify key has Places API and Maps JavaScript API enabled
3. Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set (must be public)
4. Check no browser errors in DevTools Console

### Database Issues

1. Ensure Neon is connected
2. Run migrations if needed
3. Verify tables exist: `SELECT * FROM notification_settings;`

## Production Checklist

- [ ] SMTP credentials configured in Vercel
- [ ] Google Maps API key configured in Vercel
- [ ] Notification settings initialized (POST /api/admin/notifications/setup)
- [ ] Admin dashboard protected with auth
- [ ] Test email send to both recipients
- [ ] Monitor logs dashboard
- [ ] Set up daily/weekly report schedule (if using)
- [ ] Backup database before going live

## Support

For issues or questions, refer to:
- Nodemailer docs: https://nodemailer.com/
- Google Places API: https://developers.google.com/maps/documentation/places
- Drizzle ORM: https://orm.drizzle.team/
