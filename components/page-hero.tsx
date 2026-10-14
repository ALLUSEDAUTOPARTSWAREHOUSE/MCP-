import Image from "next/image"
import type { ReactNode } from "react"

/** Maps a semantic category key to a generated cinematic hero image. */
export const HERO_IMAGES = {
  engines: "/images/heroes/hero-engines.png",
  transmissions: "/images/heroes/hero-transmissions.png",
  brakes: "/images/heroes/hero-brakes.png",
  cooling: "/images/heroes/hero-cooling.png",
  drivetrain: "/images/heroes/hero-drivetrain.png",
  electrical: "/images/heroes/hero-electrical.png",
  exhaust: "/images/heroes/hero-exhaust.png",
  suspension: "/images/heroes/hero-suspension.png",
  body: "/images/heroes/hero-body.png",
  warehouse: "/images/heroes/hero-warehouse.png",
  garage: "/images/heroes/hero-garage.png",
  salvage: "/images/heroes/hero-salvage.png",
  brands: "/images/heroes/hero-brands.png",
  support: "/images/heroes/hero-support.png",
} as const

export type HeroImageKey = keyof typeof HERO_IMAGES

/** Resolve a route/category string to the closest hero image key. */
export function resolveHeroImage(key?: string): string {
  if (!key) return HERO_IMAGES.warehouse
  const normalized = key.toLowerCase()
  if (normalized in HERO_IMAGES) return HERO_IMAGES[normalized as HeroImageKey]

  // Keyword fallbacks for category slugs and page names
  if (/(engine|motor)/.test(normalized)) return HERO_IMAGES.engines
  if (/(transmission|gearbox)/.test(normalized)) return HERO_IMAGES.transmissions
  if (/brake/.test(normalized)) return HERO_IMAGES.brakes
  if (/(cool|radiator)/.test(normalized)) return HERO_IMAGES.cooling
  if (/(drivetrain|axle|differential)/.test(normalized)) return HERO_IMAGES.drivetrain
  if (/(electric|sensor|alternator)/.test(normalized)) return HERO_IMAGES.electrical
  if (/exhaust/.test(normalized)) return HERO_IMAGES.exhaust
  if (/suspension/.test(normalized)) return HERO_IMAGES.suspension
  if (/body/.test(normalized)) return HERO_IMAGES.body
  if (/(brand|make)/.test(normalized)) return HERO_IMAGES.brands
  if (/(contact|support|help|quote)/.test(normalized)) return HERO_IMAGES.support
  if (/(salvage|yard|inventory)/.test(normalized)) return HERO_IMAGES.salvage
  if (/(about|garage|shop|blog)/.test(normalized)) return HERO_IMAGES.garage
  return HERO_IMAGES.warehouse
}

interface PageHeroProps {
  /** Semantic category key OR an explicit image path. */
  image?: HeroImageKey | string
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  /** Optional CTAs or extra content rendered under the subtitle. */
  children?: ReactNode
  /** Text alignment. Defaults to center. */
  align?: "center" | "left"
  /** Priority-load the image (use for above-the-fold heroes). Defaults true. */
  priority?: boolean
  className?: string
}

/**
 * Full-width cinematic hero banner with a generated automotive background image,
 * a dark gradient overlay for contrast, and themed typography.
 */
export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  children,
  align = "center",
  priority = true,
  className = "",
}: PageHeroProps) {
  const src =
    image && image.startsWith("/") ? image : resolveHeroImage(image)
  const alignItems = align === "center" ? "items-center text-center" : "items-start text-left"

  return (
    <section
      className={`relative isolate overflow-hidden bg-[#0d0f16] ${className}`}
      aria-label="Page banner"
    >
      {/* Background image */}
      <Image
        src={src || "/placeholder.svg"}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center -z-10"
      />

      {/* Cinematic overlays for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d0f16]/80 via-[#0d0f16]/60 to-[#0d0f16]/95" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d0f16]/70 via-transparent to-[#0d0f16]/50" />
      <div className="metal-line absolute top-0 left-0 right-0" />
      <div className="metal-line absolute bottom-0 left-0 right-0" />

      <div className="mx-auto max-w-[1280px] px-6 py-20 sm:py-24 md:py-28 relative">
        <div className={`flex flex-col gap-5 max-w-3xl ${align === "center" ? "mx-auto" : ""} ${alignItems}`}>
          {eyebrow ? (
            <div className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
              <div className="h-px w-10 bg-primary/50" />
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-primary">
                {eyebrow}
              </span>
              <div className="h-px w-10 bg-primary/50" />
            </div>
          ) : null}

          <h1 className="font-serif text-[clamp(2rem,5vw,3.75rem)] font-black uppercase tracking-tight text-white text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {title}
          </h1>

          {subtitle ? (
            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl text-pretty drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              {subtitle}
            </p>
          ) : null}

          {children ? <div className="mt-2 flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
