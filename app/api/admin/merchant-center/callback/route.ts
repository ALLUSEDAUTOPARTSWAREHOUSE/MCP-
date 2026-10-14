import { NextResponse } from 'next/server'

/**
 * Vercel Connect completes the Google OAuth token exchange and then redirects
 * the user here. The token is now cached for the user subject, so we simply
 * send them back to the Merchant Center admin page to re-run the sync.
 */
export function GET(request: Request) {
  const url = new URL('/admin/merchant-center?connected=1', request.url)
  return NextResponse.redirect(url)
}
