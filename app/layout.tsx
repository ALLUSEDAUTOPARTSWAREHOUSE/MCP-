import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { MobileThemeFab } from '@/components/mobile-theme-fab'
import { PartsAssistant } from '@/components/ai/parts-assistant'
import './globals.css'

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.auapw.com'),
  title: 'AUAPW LLC - Quality Used Auto Parts | Engines, Transmissions & More',
  description: 'AUAPW LLC - Your trusted source for quality used auto parts. Shop engines, transmissions, body parts and more from 2,000+ verified salvage yards nationwide. Free shipping, 6-month warranty.',
  generator: 'v0.dev',
  applicationName: 'AUAPW LLC',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://www.auapw.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.auapw.com',
    siteName: 'AUAPW LLC',
    title: 'AUAPW LLC - Quality Used Auto Parts | Engines, Transmissions & More',
    description: 'Your trusted source for quality used auto parts. Shop engines, transmissions, body parts and more from 2,000+ verified salvage yards nationwide.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@auapworg',
    title: 'AUAPW LLC - Quality Used Auto Parts',
    description: 'Your trusted source for quality used auto parts. Engines, transmissions, body parts and more from 2,000+ verified salvage yards.',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'AUAPW LLC',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0d0f16',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <MobileThemeFab />
            <PartsAssistant />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
