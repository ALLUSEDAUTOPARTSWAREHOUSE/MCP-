import Image from 'next/image'
import { getHeroBanner } from '@/lib/hero-banners'

interface HeroBannerProps {
  title: string
  subtitle?: string
  pathname?: string
  imageSrc?: string
}

export function HeroBanner({ title, subtitle, pathname, imageSrc }: HeroBannerProps) {
  const backgroundImage = imageSrc || (pathname ? getHeroBanner(pathname) : '/images/hero-banner-1.png')

  return (
    <section className="relative w-full h-80 sm:h-96 lg:h-[28rem] overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white mb-2 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl text-gray-200 font-medium drop-shadow-md max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
