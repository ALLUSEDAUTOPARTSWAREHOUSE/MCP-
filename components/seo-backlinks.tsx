import Link from 'next/link'

/**
 * Keyword-rich internal backlinks rendered on every product page.
 *
 * These anchor texts ("used engines", "used transmissions", brand + part
 * combinations) are what customers type into Google. Interlinking every
 * product page with these exact phrases helps search engines associate the
 * site with those queries and index the engine/transmission pages.
 */
const CORE_LINKS = [
  { href: '/used-engines-parts', label: 'Used Engines for Sale' },
  { href: '/used-transmissions-parts', label: 'Used Transmissions for Sale' },
  { href: '/acura', label: 'Used Acura Parts' },
  { href: '/used-engines', label: 'Quality Used Engines' },
  { href: '/used-transmissions', label: 'Quality Used Transmissions' },
  { href: '/used-drivetrain-parts', label: 'Used Drivetrain Parts' },
  { href: '/used-electrical-parts', label: 'Used Electrical Parts' },
  { href: '/shop', label: 'Shop All Used Auto Parts' },
]

export function SeoBacklinks({
  make,
  partType,
}: {
  /** Vehicle make for extra targeted links, e.g. "Acura". */
  make?: string
  /** Current part type, e.g. "used engine" or "used transmission". */
  partType?: string
}) {
  const normalizedType = (partType || '').toLowerCase()
  const isEngine = normalizedType.includes('engine')
  const isTransmission = normalizedType.includes('transmission')

  return (
    <nav
      aria-label="Popular part searches"
      className="border-t border-border/40 bg-card/30 py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Popular Searches
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {/* Contextual links first: exact phrases buyers search on Google */}
          {make && isEngine && (
            <li>
              <Link
                href="/used-engines-parts"
                className="text-sm text-primary hover:underline"
              >
                Used {make} Engines
              </Link>
            </li>
          )}
          {make && isTransmission && (
            <li>
              <Link
                href="/used-transmissions-parts"
                className="text-sm text-primary hover:underline"
              >
                Used {make} Transmissions
              </Link>
            </li>
          )}
          {CORE_LINKS.map((link) => (
            <li key={link.href + link.label}>
              <Link href={link.href} className="text-sm text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
