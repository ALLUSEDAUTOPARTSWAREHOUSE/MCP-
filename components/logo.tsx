import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"

interface LogoProps {
  size?: LogoSize
  className?: string
  priority?: boolean
  showGlow?: boolean
  variant?: "default" | "ring" | "medallion"
}

const SIZE_MAP: Record<LogoSize, { width: number; height: number; containerClass: string }> = {
  xs: { width: 32, height: 32, containerClass: "w-8 h-8" },
  sm: { width: 46, height: 46, containerClass: "w-[46px] h-[46px]" },
  md: { width: 56, height: 56, containerClass: "w-14 h-14" },
  lg: { width: 72, height: 72, containerClass: "w-[72px] h-[72px] sm:w-[90px] sm:h-[90px]" },
  xl: { width: 100, height: 100, containerClass: "w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] lg:w-[110px] lg:h-[110px]" },
  "2xl": { width: 220, height: 220, containerClass: "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] lg:w-[220px] lg:h-[220px]" },
  "3xl": { width: 280, height: 280, containerClass: "w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px]" },
  "4xl": { width: 360, height: 360, containerClass: "w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[360px] lg:h-[360px]" },
  "5xl": { width: 440, height: 440, containerClass: "w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px]" },
  "6xl": { width: 520, height: 520, containerClass: "w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[520px] lg:h-[520px]" },
  "7xl": { width: 600, height: 600, containerClass: "w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] lg:w-[600px] lg:h-[600px]" },
}

export function Logo({
  size = "md",
  className,
  priority = false,
  showGlow = false,
  variant = "default",
}: LogoProps) {
  const { width, height, containerClass } = SIZE_MAP[size]

  const baseContainerStyles = cn(
    "flex items-center justify-center overflow-hidden shrink-0",
    containerClass,
    className
  )

  // The logo PNG is transparent, so no variant adds a background fill,
  // border, or container box — the mark is shown on its own.
  const containerStyles = baseContainerStyles

  return (
    <div className="relative">
      <div className={containerStyles}>
        <Image
          src="/auapw-logo.png"
          alt="AUAPW LLC - Quality Used Auto Parts"
          width={width}
          height={height}
          className="object-contain"
          priority={priority}
        />
      </div>
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(232,232,232,0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      )}
    </div>
  )
}
