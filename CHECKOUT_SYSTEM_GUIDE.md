# Complete Checkout System Documentation

## Overview

A comprehensive 5-step checkout flow with order creation, payment processing, email notifications, and Google Maps address suggestions.

## Features Implemented

### 1. Multi-Step Checkout Flow

**Step 1: Customer Details**
- First name, last name, email, phone
- Billing address with Google Maps autocomplete suggestions
- Address validation (street, city, state, zip, latitude/longitude)
- Order number auto-generated: `ORD-YYYY-XXXXXX`

**Step 2: Shipping Address**
- Option to use same as billing address
- Alternative shipping address with Google Maps autocomplete
- Full address parsing and validation

**Step 3: Vehicle Details**
- VIN (Vehicle Identification Number) entry
- Year, Make, Model, Trim
- Engine and Transmission details
- Mileage tracking
- Optional nickname for vehicle (e.g., "My Car")

**Step 4: Payment Method**
- Multiple payment methods:
  - Credit Card (with Luhn algorithm validation)
  - Debit Card (same validation as credit card)
  - PayPal
  - Bank Transfer
- Card validation for Visa/Mastercard/Amex/Discover
- Secure card details entry (16-digit card number, MM/YY expiry, 3-4 digit CVV)
- CVV field masked for security
- Mock authorization code generation

**Step 5: Review & Confirm**
- Full order summary review
- Customer details recap
- Vehicle information confirmation
- Payment method verification
- Single-click order submission

### 2. Order Creation & Numbering

**Order Number Format**: `ORD-YYYY-XXXXXX`
- Year: Current year (e.g., 2026)
- XXXXXX: Last 6 digits of timestamp + random string

**Database Recording**:
- Order created in `orders` table with:
  - Unique order number
  - Customer details (stored as JSON)
  - Billing and shipping addresses
  - Order status: "pending"
  - Line items (stored in `order_items` table)
  - Total amount with subtotal, tax, shipping

- Payment record created in `payments` table with:
  - Payment status: "authorized" (mock)
  - Authorization code (mock): `AUTH-XXXXXX`
  - Card last 4 digits
  - Payment method type
  - Card expiry

### 3. Card Validation

**Luhn Algorithm Implementation**:
- Validates 16-digit credit/debit card numbers
- Detects invalid card numbers mathematically
- Card brand detection: VISA, Mastercard, American Express, Discover

**Expiry Validation**:
- Format: MM/YY
- Prevents expired cards from being used
- Current month/year comparison

**CVV Validation**:
- 3-4 digit requirement
- Type: Password field (masked)
- Validates before order creation

All validations happen client-side with clear error messaging.

### 4. Email Notifications

**Recipients**:
- Admin emails: `auapworld@gmail.com`, `sale@auapw.com`
- Customer email: User-provided email

**Notification Events**:
- **newOrder** triggered on successful order creation
- Email sent with:
  - Order number
  - Customer name and contact info
  - Billing and shipping addresses
  - Vehicle details (Year/Make/Model/VIN)
  - Line items and total amount
  - Mock authorization code
  - Payment method used
  - Last 4 digits of card (for credit/debit)

**Email Status Tracking**:
- All notifications logged in `notification_logs` table
- Status: "pending" → "sent" or "failed"
- Failure reasons captured for troubleshooting
- Retry attempts tracked
- Metadata includes full email data

**Important**: Currently notifications show as "pending" in logs. To activate real email sending, configure:
1. `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL` environment variables
2. Update `lib/email-service.ts` with actual SMTP client if needed

### 5. Google Maps Integration

**Address Autocomplete Component** (`components/address-autocomplete.tsx`):
- Real-time address suggestions as user types
- Parses addresses into components:
  - Street address
  - City
  - State
  - ZIP code
  - Latitude/Longitude (for mapping)
- Used in both billing and shipping address fields
- Requires: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable

**Maps Script Loading**:
- Loaded in root layout: `app/layout.tsx`
- Loads only if API key is available
- Uses `afterInteractive` strategy for non-blocking load

### 6. Database Schema

**New Tables**:

**`orders`**
- id (primary key)
- userId
- orderNumber (unique)
- status (pending, confirmed, shipped, etc.)
- totalAmount, subtotal, tax, shippingCost
- billingAddress (JSON)
- shippingAddress (JSON)
- items (JSON array)
- createdAt, updatedAt, estimatedDelivery

**`payments`**
- id (primary key)
- orderId
- userId
- amount
- status (pending, authorized, captured, failed)
- paymentMethod (credit_card, debit_card, paypal, bank_transfer)
- cardDetails (JSON: {last4, expiry})
- cardToken
- authorizationCode
- failureReason
- createdAt, updatedAt

**`order_items`**
- id (primary key)
- orderId
- productId
- productName
- quantity, unitPrice, totalPrice
- partNumber
- createdAt

### 7. API Endpoints

**`POST /api/checkout/create-order`**
- Accepts: orderNumber, formData, cartItems, totalAmount
- Creates order in database
- Creates payment record with mock authorization
- Creates order line items
- Triggers email notifications
- Returns: {success, orderId, orderNumber, message}
- Errors: Returns 500 with error description

### 8. Card Validation Utilities

**`lib/card-validation.ts`**:
- `validateCardNumber()` - Luhn algorithm
- `validateExpiry()` - Expiry date validation
- `validateCVV()` - CVV format check
- `validateCardDetails()` - Complete validation
- `getCardBrand()` - Detect card type
- `maskCardNumber()` - Display masking (e.g., **** **** **** 4242)

### 9. Success Flow

1. User fills all 5 steps
2. Submits on Review step
3. API creates order + payment + items
4. Notifications sent (status: pending)
5. Success screen displayed with:
   - Order number
   - Total amount
   - Customer email
   - "Check your email for next steps" message
   - "We have not charged anything yet" disclaimer

## Setup Instructions

### 1. Environment Variables

Add to `.env.local` or Vercel project settings:

```bash
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# SMTP Email (optional - for real email sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=auapworld@gmail.com
```

### 2. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Maps JavaScript API" and "Places API"
4. Create API key (restrict to your domain)
5. Add to environment variables as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 3. Database Migration

The new tables (`orders`, `payments`, `orderItems`) are defined in `lib/db/schema.ts`. If using Drizzle ORM migrations, run:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

Or use your database client to manually create the tables based on the schema.

## Testing the Checkout

### Test Cards (for local development with mock authorization):

- **VISA**: 4111111111111111 (Expiry: 12/25, CVV: 123)
- **Mastercard**: 5555555555554444 (Expiry: 12/25, CVV: 123)
- **Amex**: 378282246310005 (Expiry: 12/25, CVV: 1234)

All cards will pass Luhn validation and mock authorization.

### Test Flow:

1. Add items to cart via `/shop` or `/parts`
2. Navigate to `/checkout`
3. Fill out all 5 steps with test data
4. Use test card numbers above
5. Submit and verify:
   - Order appears in database
   - Notification log shows "pending" status
   - Success page displays order details
   - Customer email shown

## Future Enhancements

1. **Real Payment Processing**:
   - Integrate Authorize.net API for live card processing
   - Update `lib/email-service.ts` with real SMTP
   - Change payment status from "authorized" to "captured" after charging

2. **VIN Lookup**:
   - Integrate NHTSA VIN decoder API
   - Auto-populate Year/Make/Model from VIN

3. **Shipping Calculation**:
   - Integrate real shipping APIs (USPS, UPS, FedEx)
   - Calculate dynamic shipping costs based on address

4. **Order Management**:
   - Admin dashboard to view/manage orders
   - Customer order tracking
   - Invoice generation

5. **Notification Enhancements**:
   - HTML email templates (currently plain text)
   - Scheduled reports
   - Payment failure handling

## Files Created/Modified

**New Files**:
- `/app/checkout/page.tsx` - Main checkout page (upgraded)
- `/app/api/checkout/create-order/route.ts` - Order creation API
- `/lib/card-validation.ts` - Card validation utilities
- `/components/address-autocomplete.tsx` - Google Maps address field

**Modified Files**:
- `/lib/db/schema.ts` - Added `orders`, `payments`, `orderItems` tables
- `/app/layout.tsx` - Added Google Maps script loading

**Existing Integrations Used**:
- `lib/email-service.ts` - Email delivery
- `lib/notification-dispatcher.ts` - Notification routing
- `lib/db/` - Drizzle ORM database
- Components: UI library (Button, Input, Textarea, etc.)

## Support

For questions or issues:
1. Check the Google Maps API key configuration
2. Verify SMTP settings if email not sending
3. Check database logs for order creation errors
4. Review notification_logs table for email delivery status
