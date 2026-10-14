# Complete Authentication System Guide

## Overview

The AUAPW authentication system provides multiple signup/signin options:
- **Email & Password** — Traditional email/password authentication with OTP email verification
- **Google OAuth** — One-click signup/signin with Google account
- **Apple OAuth** — One-click signup/signin with Apple ID

## Setup Requirements

### Required Environment Variables

1. **BETTER_AUTH_SECRET** (REQUIRED)
   - Generate with: `openssl rand -base64 32`
   - Used to sign session tokens securely
   - Must be 32+ characters

2. **Google OAuth** (Optional)
   - `GOOGLE_CLIENT_ID` — From [console.cloud.google.com](https://console.cloud.google.com)
   - `GOOGLE_CLIENT_SECRET` — Same project
   - Steps: Create project → OAuth 2.0 Client ID (Web application) → Add redirect URIs

3. **Apple OAuth** (Optional)
   - `APPLE_CLIENT_ID` — Apple Developer Services ID
   - `APPLE_TEAM_ID` — Your Apple Developer Team ID
   - `APPLE_KEY_ID` — Key ID for Server-to-Server Tokens
   - `APPLE_PRIVATE_KEY` — Private key file content (keep secure)
   - Steps: developer.apple.com → App IDs → Services → configure Sign in with Apple

## Authentication Flow

### Email & Password Signup

1. User enters: Full Name, Email, Password (min 8 chars)
2. Better Auth creates user account
3. Verification OTP sent to email
4. User enters 6-digit code on verification page
5. Account activated, automatic redirect to homepage
6. User receives "Welcome" notification email

### OAuth Signup (Google/Apple)

1. User clicks "Sign up with [Provider]"
2. Redirected to provider's login
3. User authorizes AUAPW app
4. User auto-logged in, account created
5. Automatically verified (OAuth providers verify identity)
6. Redirect to homepage

### Sign In

1. **Email/Password**: Enter credentials → Instant login (already verified)
2. **OAuth**: Click provider button → Redirected to auth

## Key Features

### Email Verification
- 6-digit OTP sent to user email
- Code expires after 15 minutes
- Resend available via "Change email" link
- Manual address entry fallback if not using OTP flow

### Session Management
- Sessions last 7 days
- Automatically refresh every 24 hours
- Secure HTTP-only cookies
- Works across v0 preview, staging, and production

### OAuth Integration
- Credentials optional — system gracefully handles missing OAuth keys
- When Google/Apple credentials added, OAuth buttons appear automatically
- No code changes needed to enable OAuth

## File Structure

```
lib/
  auth.ts                     ← Better Auth server config with OAuth providers
  auth-client.ts              ← Browser auth client
app/
  sign-up/page.tsx            ← Sign-up page with Navbar/Footer
  sign-in/page.tsx            ← Sign-in page with Navbar/Footer
  api/
    auth/[...all]/route.ts    ← Better Auth HTTP handler
    auth/verify-email/route.ts ← Email verification endpoint (POST)
    notifications/init/route.ts ← Initialize notification types
components/
  auth-form.tsx               ← Shared form component (email, OAuth, OTP)
```

## API Endpoints

### `POST /api/auth/verify-email`
Verify user's email with OTP code

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "message": "Email verified successfully"
}
```

**Response (Error):**
```json
{
  "error": "Invalid verification code"
}
```

## Database Tables (Better Auth)

- **user** — User accounts (id, name, email, emailVerified, phone, address, etc.)
- **session** — Active sessions (token, expiresAt, userId)
- **account** — OAuth provider links (providerId, accountId, accessToken, etc.)
- **verification** — OTP codes (identifier, value, expiresAt)

## Notification Events

When a user signs up or verifies email, notifications are sent to `auapworld@gmail.com` and `sale@auapw.com`:

- **userSignup** — Welcome + verification instructions
- **emailVerified** — Account activated confirmation

## Usage Examples

### Check if User is Logged In
```tsx
'use client'
import { useSession } from '@/lib/auth-client'

export function Profile() {
  const { data: session } = useSession()
  
  if (!session?.user) {
    return <p>Please sign in</p>
  }
  
  return <p>Hello, {session.user.name}!</p>
}
```

### Protected Page/Component
```tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in?redirect=/protected')
  }
  
  return <div>Welcome back, {session.user.name}!</div>
}
```

### Server Action with User Scoping
```tsx
'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserOrders() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  
  return db.select().from(orders).where(eq(orders.userId, session.user.id))
}
```

## Troubleshooting

### Session Cookie Not Stored
- **Cause**: In development, the v0 preview renders in a cross-site iframe
- **Fix**: The code already includes `sameSite: "none", secure: true` for development — this is configured correctly

### OAuth Buttons Not Showing
- **Cause**: Missing OAuth credentials
- **Fix**: Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or Apple credentials to environment

### Email Verification OTP Not Received
- **Cause**: Email service not configured
- **Fix**: Set SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL) — see NOTIFICATIONS_INTEGRATION_GUIDE.md

### "User already exists" Error
- **Cause**: Email already registered
- **Fix**: Show link to sign-in page or password reset flow (not yet implemented)

## Next Steps

1. Add `BETTER_AUTH_SECRET` environment variable (required)
2. Test email signup with verification
3. (Optional) Add Google OAuth credentials and test
4. (Optional) Add Apple OAuth credentials and test
5. Configure SMTP for email notifications (see NOTIFICATIONS_INTEGRATION_GUIDE.md)
