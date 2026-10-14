# API Documentation

## Overview
Complete API reference for AUAPW LLC Auto Parts website. All endpoints are relative to `https://your-domain.com/api`.

---

## Authentication

### JWT Token Generation
**Endpoint:** `POST /api/intercom-token`

**Description:** Generates a secure HS256-signed JWT token for Intercom messenger authentication.

**Request Body:**
```json
{
  "userId": "string (required)",
  "email": "string (optional)",
  "name": "string (optional)"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

**Status Codes:**
- `200 OK` - Token generated successfully
- `400 Bad Request` - Missing required userId
- `500 Internal Server Error` - JWT signing failed or missing INTERCOM_API_SECRET

**Example:**
```bash
curl -X POST http://localhost:3000/api/intercom-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-12345",
    "email": "john@example.com",
    "name": "John Smith"
  }'
```

**Environment Variables Required:**
- `INTERCOM_API_SECRET` - Your Intercom API secret for JWT signing

---

## Intercom Messenger

### Installation
The Intercom messenger is automatically initialized on all pages via the `IntercomProvider` component in the root layout.

**App ID:** `pldz9zi1`
**Widget URL:** `https://widget.intercom.io/widget/pldz9zi1`

### Configuration
- **API Base:** `https://api-iam.intercom.io`
- **Session Duration:** 86400000 ms (1 day)
- **Authentication:** Secure JWT via `/api/intercom-token`

### Initialization Behavior

**For Authenticated Users:**
1. Fetches JWT token from `/api/intercom-token`
2. Calls `window.Intercom('boot', { intercom_user_jwt: token })`
3. Enables identity verification for secure conversations

**For Anonymous Visitors:**
1. Boots Intercom without JWT token
2. Conversations saved in browser via cookie
3. No user identification

### JavaScript API

```javascript
// Intercom is available globally as window.Intercom

// Boot messenger (automatic via IntercomProvider)
window.Intercom('boot', {
  api_base: 'https://api-iam.intercom.io',
  app_id: 'pldz9zi1',
  intercom_user_jwt: token // Optional, for authenticated users
});

// Show messenger
window.Intercom('show');

// Hide messenger
window.Intercom('hide');

// Logout user
window.Intercom('logout');

// Update user
window.Intercom('update', {
  user_id: 'user-12345',
  email: 'user@example.com',
  name: 'User Name'
});
```

### Messenger Features
- **Availability:** Appears in bottom-right corner on all pages
- **Conversations:** Secure JWT-authenticated conversations for logged-in users
- **Anonymous Support:** Cookie-based conversations for visitors
- **Session Persistence:** 1-day session duration with automatic refresh

---

## Product Search API

### Search Brand Products
**Endpoint:** GET `/brands/[brand]`

**Query Parameters:**
- `model` (optional) - Filter by car model (auto-normalized for part-type suffixes)
- `category` (optional) - Filter by part category (engine, transmission, etc.)
- `q` (optional) - Search query (matches name, compatibility, or year)

**Example:**
```bash
# Get Ford Mustang engines
GET /brands/ford?model=Mustang&category=engine

# Search 2015 model year
GET /brands/ford?model=Mustang&q=2015

# Get Acura Integra transmissions
GET /brands/acura?model=Integra&category=transmission
```

**Response:** HTML page with filtered product grid

---

## Product Images API

### Product Image Endpoint
**Endpoint:** GET `/api/product-image/[brand]/[sku]`

**Parameters:**
- `brand` - Brand slug (ford, acura, honda, etc.)
- `sku` - Product SKU/slug

**Response:** 
- Returns professional product photograph (locked 4:3 aspect ratio)
- Status: `200 OK` with image file
- Fallback: Generated OG card image if photo unavailable

**Example:**
```bash
GET /api/product-image/ford/2020-ford-mustang-engine-5-0l-v8
GET /api/product-image/acura/2004-acura-integra-transmission-automatic
```

**Image Coverage:**
- **Engines:** Professional photos for all 50+ brands
- **Transmissions:** Professional type-specific photos (CVT, Manual, Automatic) for all brands

---

## Environment Variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `INTERCOM_API_SECRET` | Yes | `es2OvSafq_aUEZD...` | JWT signing for Intercom authentication |
| `NEXT_PUBLIC_APP_URL` | No | `https://example.com` | Public app URL for redirects |

---

## Error Handling

### Common Status Codes
- `200 OK` - Request successful
- `400 Bad Request` - Invalid parameters or missing required fields
- `401 Unauthorized` - Authentication failed or invalid JWT
- `404 Not Found` - Resource not found (brand, product, etc.)
- `500 Internal Server Error` - Server error (check env vars, logs)

### Example Error Response
```json
{
  "error": "Missing required parameter: userId",
  "status": 400
}
```

---

## Rate Limiting

No rate limiting currently implemented. Production deployments should add rate limiting via middleware.

---

## Support

For issues or questions:
- **Intercom Messenger:** Available on all pages (bottom-right corner)
- **GitHub Issues:** Create an issue in the repository
- **Email:** contact@example.com
