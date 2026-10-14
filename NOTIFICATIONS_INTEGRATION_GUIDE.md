# Notifications & Address Autocomplete Integration Guide

## Overview

AUAPW LLC now features a comprehensive notification system with 14 event types, HTML email templates, delivery confirmation, retry logic, and admin control. Additionally, customers can use Google Maps address autocomplete when entering their address.

## Features

### Notification System
- ✅ Real-time email notifications for 14 event types
- ✅ HTML email templates with professional styling
- ✅ Delivery confirmation where supported
- ✅ Retry failed sends with exponential backoff
- ✅ Queue emails for reliability
- ✅ Log every notification with status (Sent, Failed, Pending)
- ✅ Admin control to enable/disable notification types
- ✅ Configurable recipients per event type

### Address Autocomplete
- ✅ Google Places API integration
- ✅ Real-time address suggestions as user types
- ✅ Address parsing (street, city, state, zip, country)
- ✅ Latitude/longitude extraction
- ✅ US-only address suggestions (configurable)

---

## Setup

### 1. Environment Variables

Add these to your `.env.local`:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@auapw.com

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Getting SMTP Credentials (Gmail):
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Use as `SMTP_PASS`

#### Getting Google Maps API Key:
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Places API" and "Maps JavaScript API"
4. Create an API key
5. Use as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 2. Database Migration

The notification tables are automatically created via Drizzle ORM:
- `notificationSettings` — Configuration for each event type
- `notificationLogs` — Audit trail of all sent notifications

Run:
```bash
npm run db:push
```

### 3. Initialize Notification Settings

On first deployment, seed the 14 event types with default settings:

```bash
curl -X PUT http://localhost:3000/api/admin/notifications/settings \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "newOrder",
    "enabled": true,
    "recipients": ["auapworld@gmail.com", "sale@auapw.com"],
    "subject": "New Order #{{orderId}}"
  }'
```

Or use the admin dashboard at `/admin/notifications`

---

## Usage

### Sending Notifications

Import the notification dispatcher and call the appropriate function:

```typescript
import { notifications } from '@/lib/notification-dispatcher'

// In your order creation endpoint
export async function createOrder(data: OrderData) {
  const order = await db.insert(orders).values(data).returning()

  // Send notification
  await notifications.newOrder({
    orderId: order.id,
    customerName: order.customerName,
    total: order.total,
    itemCount: order.items.length,
    createdAt: new Date(),
  })

  return order
}
```

### Available Notification Functions

```typescript
// Customer & Account
notifications.newCustomer({
  customerName: string
  email: string
  phone?: string
  createdAt: Date
})

// Orders
notifications.newOrder({
  orderId: string
  customerName: string
  total: number
  itemCount: number
  createdAt: Date
})

// Payments
notifications.paymentSuccess({
  orderId: string
  amount: number
  paymentMethod: string
  transactionId: string
})

notifications.paymentFailure({
  orderId: string
  amount: number
  reason: string
  timestamp: Date
})

notifications.highRiskOrder({
  orderId: string
  riskScore: number
  reason: string
})

notifications.chargeback({
  orderId: string
  amount: number
  reasonCode: string
})

notifications.refund({
  orderId: string
  amount: number
  reason: string
})

// Support & Feedback
notifications.contactForm({
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  timestamp: Date
})

notifications.quoteRequest({
  customerName: string
  email: string
  phone?: string
  partName?: string
  quantity?: number
  notes?: string
})

notifications.ticketCreated({
  ticketId: string
  priority: string
  subject: string
  description: string
})

notifications.aiChatEscalation({
  conversationId: string
  customerName: string
  issue: string
  reason: string
})

// Shipping
notifications.shipmentNotification({
  orderId: string
  trackingNumber: string
  carrier: string
  estimatedDelivery: string
})

// Reports
notifications.sendDailyReport({
  date: Date
  newOrders: number
  totalRevenue: number
  newCustomers: number
  supportTickets: number
})

notifications.sendWeeklyReport({
  week: string
  newOrders: number
  totalRevenue: number
  newCustomers: number
  supportTickets: number
})
```

### Using Address Autocomplete in Forms

```typescript
'use client'

import { useState } from 'react'
import { AddressAutocomplete } from '@/components/address-autocomplete'

export function CheckoutForm() {
  const [address, setAddress] = useState('')
  const [addressDetails, setAddressDetails] = useState(null)

  const handleAddressChange = (value: string, details?: any) => {
    setAddress(value)
    if (details) {
      setAddressDetails(details)
      console.log('Selected address:', {
        full: value,
        street: details.street,
        city: details.city,
        state: details.state,
        zip: details.zip,
        lat: details.lat,
        lng: details.lng,
      })
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      // Submit with addressDetails
      console.log('Submitting order with address:', addressDetails)
    }}>
      <AddressAutocomplete
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter shipping address..."
      />
      <button type="submit">Continue to Payment</button>
    </form>
  )
}
```

---

## Admin Dashboard

Access the admin dashboard at `/admin/notifications` to:

- **View all 14 notification types** with enabled/disabled status
- **Configure recipients** — Add or remove email addresses per event type
- **View notification logs** — See all sent, failed, and pending notifications
- **Filter logs** — By event type, status, or date range
- **Retry failed sends** — (Coming soon) Manually retry failed notifications

---

## Email Templates

HTML email templates are defined in `/lib/email-service.ts`. Each template includes:
- Professional styling with brand colors
- Clear call-to-action buttons where applicable
- Order/transaction details
- Status indicators (✅ for success, ❌ for failure)

To customize templates, edit the `emailTemplates` object in `email-service.ts`.

---

## Monitoring & Troubleshooting

### Check Notification Status
```bash
curl http://localhost:3000/api/admin/notifications/logs?limit=20
```

### View All Settings
```bash
curl http://localhost:3000/api/admin/notifications/settings
```

### Common Issues

**"Google Maps API not loaded"**
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Verify the API key has "Places API" and "Maps JavaScript API" enabled
- Check browser console for API errors

**"SMTP credentials missing - emails will not send"**
- Ensure `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are set in `.env.local`
- Verify Gmail app password (not regular password) is used
- Check that "Less secure app access" is enabled if using non-app password

**Notifications not appearing in logs**
- Ensure notification type is enabled in admin dashboard
- Verify recipient email addresses are correct
- Check browser console and server logs for errors

---

## API Reference

### GET /api/admin/notifications/settings
Get all notification settings

**Response:**
```json
[
  {
    "id": "uuid",
    "eventType": "newOrder",
    "enabled": true,
    "recipients": ["auapworld@gmail.com"],
    "subject": "New Order #{{orderId}}",
    "createdAt": "2026-07-23T12:00:00Z",
    "updatedAt": "2026-07-23T12:00:00Z"
  }
]
```

### PATCH /api/admin/notifications/settings/:id
Update notification setting

**Body:**
```json
{
  "enabled": true,
  "recipients": ["email1@example.com", "email2@example.com"]
}
```

### GET /api/admin/notifications/logs
Get notification logs

**Query Params:**
- `limit` (default: 50) — Number of logs to return
- `status` — Filter by 'pending', 'sent', or 'failed'
- `eventType` — Filter by event type

---

## Next Steps

1. ✅ Set environment variables
2. ✅ Run database migration
3. ✅ Initialize notification settings via admin dashboard
4. ✅ Integrate notifications into order flow
5. ✅ Add address autocomplete to checkout forms
6. ✅ Test notifications with test orders
7. ✅ Monitor logs via admin dashboard

For questions or issues, check the logs at `/admin/notifications` or contact support.
