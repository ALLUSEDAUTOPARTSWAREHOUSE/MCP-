"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const SLIDES = [
  { src: "/images/hero-slide-1.png", alt: "Used engines in industrial warehouse" },
  { src: "/images/hero-slide-2.png", alt: "Aerial view of auto salvage yard" },
  { src: "/images/hero-slide-3.png", alt: "Used transmissions and auto parts" },
  { src: "/images/hero-slide-4.png", alt: "Vast auto parts warehouse interior" },
  { src: "/images/section-used-engines.png", alt: "Premium used engine block" },
  { src: "/images/section-used-transmissions.png", alt: "High-quality transmission" },
]

const INTERVAL = 4500

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % SLIDES.length
        setPrev(c)
        setTransitioning(true)
        return next
      })
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!transitioning) return
    const t = setTimeout(() => {
      setPrev(null)
      setTransitioning(false)
    }, 1200)
    return () => clearTimeout(t)
  }, [transitioning])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Outgoing slide */}
      {prev !== null && (
        <Image
          key={`prev-${prev}`}
          src={SLIDES[prev].src}
          alt=""
          fill
          className="object-cover opacity-0 scale-110 transition-all duration-[1200ms] ease-in-out"
          priority
        />
      )}

      {/* Active slide */}
      {SLIDES.map((slide, idx) => (
        <Image
          key={`slide-${idx}`}
          src={slide.src}
          alt={slide.alt}
          fill
          className={`object-cover transition-all duration-[1200ms] ease-in-out ${
            idx === current
              ? "opacity-70 scale-105"
              : "opacity-0 scale-110"
          }`}
          priority={idx === 0}
        />
      ))}

      {/* Lighter vignette overlays for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,8,8,0.35)] via-[rgba(8,8,8,0.05)] to-[rgba(8,8,8,0.75)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.2)] via-transparent to-[rgba(8,8,8,0.2)]" />

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[3px] rounded-full transition-all duration-500 ${
              idx === current ? "w-8 bg-white" : "w-3 bg-white/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
