"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowRight } from "lucide-react"

interface RecPart {
  id: string
  name: string
  slug: string
  category: string
  price: number
  image: string
  url: string
}

export function PartRecommendations({ productId }: { productId: string }) {
  const [pitch, setPitch] = useState("")
  const [parts, setParts] = useState<RecPart[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        setPitch(data.pitch || "")
        setParts(Array.isArray(data.parts) ? data.parts : [])
      })
      .catch(() => {
        if (active) setParts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [productId])

  if (loading) {
    return (
      <section className="mt-12" aria-label="AI recommendations loading">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Complete Your Repair</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card/50 h-64 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (parts.length === 0) return null

  return (
    <section className="mt-12" aria-label="AI-powered part recommendations">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Complete Your Repair</h2>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full">
          AI Picks
        </span>
      </div>
      {pitch ? <p className="text-sm text-muted-foreground mb-5 max-w-3xl text-pretty">{pitch}</p> : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={part.url}
            className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-primary"
          >
            <div className="relative aspect-square bg-secondary/30">
              <Image
                src={part.image || "/placeholder.svg?height=300&width=300&query=acura+auto+part"}
                alt={part.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex flex-col gap-1 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{part.category}</span>
              <span className="text-xs font-semibold text-foreground line-clamp-2 min-h-[2rem]">{part.name}</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-black text-foreground">${part.price.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
