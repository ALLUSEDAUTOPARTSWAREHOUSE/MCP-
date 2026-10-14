import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Used Auto Parts Inventory | AUAPW LLC',
  description: 'Browse our complete inventory of quality used auto parts. Filters by price, condition, warranty, and location. Find the exact part you need from 2,000+ verified salvage yards.',
  keywords: ['used auto parts', 'car parts', 'engine parts', 'transmission', 'auto salvage', 'used parts inventory'],
  openGraph: {
    title: 'Used Auto Parts Inventory | AUAPW LLC',
    description: 'Browse quality used auto parts with advanced filtering. Price, condition, warranty, and location filters available.',
    url: 'https://www.auapw.com/parts',
  },
}

export default function PartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
