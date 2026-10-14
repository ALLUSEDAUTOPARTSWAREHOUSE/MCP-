"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bot, Send, X, Sparkles, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PartResult {
  id: string
  name: string
  model?: string
  year?: string
  category?: string
  price?: number
  url: string
}

const SUGGESTIONS = [
  "Engine for a 2019 Acura MDX",
  "Do you have a TL transmission?",
  "Cheapest CL engine you have",
]

export function PartsAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  function submit(text: string) {
    const value = text.trim()
    if (!value || isBusy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <>
      {/* Launcher - Mechanic Badge */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Parts Assistant"
          className="fixed bottom-6 right-6 z-[9985] flex flex-col items-center gap-1.5 transition-transform hover:scale-110 max-sm:bottom-24 max-sm:right-4"
        >
          <div className="relative h-20 w-20 drop-shadow-lg">
            <Image
              src="/images/ai/mechanic-badge.png"
              alt="Parts Assistant"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">Parts Assistant</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9995] flex h-[min(600px,calc(100vh-3rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/50 max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:w-auto">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 bg-[#3a3d44] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden ring-1 ring-primary/40">
                <Image
                  src="/images/ai/mechanic-badge.png"
                  alt="Parts Assistant"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">Parts Assistant</p>
                <p className="flex items-center gap-1 text-[11px] text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  AI-powered · Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                  <Sparkles className="h-7 w-7 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Find the right part, fast</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ask me about engines, transmissions, fitment, pricing, or warranty.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-lg border border-white/10 bg-secondary/40 px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {status === "submitted" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching inventory...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-[#3a3d44] px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                ) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              placeholder="Ask about a part..."
              className="min-h-[40px] flex-1 rounded-lg border border-white/10 bg-background/60 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isBusy}
              className="h-10 w-10 shrink-0 rounded-lg"
            >
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
    </>
  )
}

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === "user"

  // Collect any product results emitted by the searchParts / recommendParts tools.
  const parts: PartResult[] = []
  for (const part of message.parts ?? []) {
    if (
      typeof part.type === "string" &&
      part.type.startsWith("tool-") &&
      part.state === "output-available" &&
      part.output?.parts
    ) {
      for (const p of part.output.parts) parts.push(p)
    }
  }

  const textContent = (message.parts ?? [])
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("")

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {textContent && (
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "rounded-br-sm bg-primary text-primary-foreground"
                : "rounded-bl-sm bg-secondary/60 text-foreground"
            }`}
          >
            {textContent}
          </div>
        )}

        {/* Product result cards */}
        {parts.length > 0 && (
          <div className="flex w-full flex-col gap-1.5">
            {parts.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={p.url}
                className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-card px-3 py-2 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.category}
                    {typeof p.price === "number" ? ` · $${p.price.toLocaleString()}` : ""}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
