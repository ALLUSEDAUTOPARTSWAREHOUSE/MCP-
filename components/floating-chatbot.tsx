"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bot, Send, X, Sparkles, Loader2, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContentResult {
  title: string
  description?: string
  url: string
  type: "product" | "category" | "page" | "part"
  price?: number
}

interface WebsiteLink {
  title: string
  description: string
  url: string
  category: "product" | "guide" | "policy" | "service" | "tool" | "category"
}

const SUGGESTIONS = [
  "What parts do you have for Acura?",
  "How much does shipping cost?",
  "Tell me about your warranty",
  "Can you help me find an engine?",
  "Show me your return policy",
  "Browse transmission parts",
]

export function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chatbot" }),
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
      {/* Floating Launcher Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AUAPW Chatbot"
          className="fixed bottom-6 right-6 z-[9985] flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 max-sm:bottom-4 max-sm:right-4 group"
        >
          <div className="absolute bottom-16 right-0 bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-sm:hidden">
            Chat with us
          </div>
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center text-white ring-4 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
            <MessageCircle className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded">AUAPW Bot</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9995] flex h-[min(600px,calc(100vh-3rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:w-auto">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-white/30">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">AUAPW Chatbot</p>
                <p className="flex items-center gap-1 text-xs text-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                  Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 ring-2 ring-blue-200">
                  <Sparkles className="h-7 w-7 text-blue-600" />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Welcome to AUAPW!</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Ask me anything about our products, services, or find the perfect part for your vehicle.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs font-medium text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-100"
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
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finding relevant content...
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
            className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-3 py-3"
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
              placeholder="Ask me anything..."
              className="min-h-[40px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isBusy}
              className="h-10 w-10 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
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

  // Collect content results and website links from tool outputs
  const content: ContentResult[] = []
  const websiteLinks: WebsiteLink[] = []
  
  for (const part of message.parts ?? []) {
    if (
      typeof part.type === "string" &&
      part.type.startsWith("tool-") &&
      part.state === "output-available" &&
      part.output
    ) {
      // Handle searchWebsite tool results
      if (part.type === "tool-searchWebsite" && part.output.pages) {
        for (const page of part.output.pages) {
          websiteLinks.push(page)
        }
      }
      // Handle searchParts and recommendParts tool results
      else if (part.output.results) {
        for (const r of part.output.results) content.push(r)
      }
      // Handle searchParts with parts array
      else if (part.output.parts) {
        for (const p of part.output.parts) {
          content.push({
            title: p.name,
            description: p.category ? `${p.category}${p.year ? ` - ${p.year}` : ""}` : undefined,
            url: p.url,
            type: "product",
            price: p.price,
          })
        }
      }
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
                ? "rounded-br-sm bg-blue-600 text-white"
                : "rounded-bl-sm bg-gray-100 text-gray-900"
            }`}
          >
            {textContent}
          </div>
        )}

        {/* Website links */}
        {websiteLinks.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {websiteLinks.slice(0, 5).map((link, idx) => (
              <Link
                key={`website-${idx}`}
                href={link.url}
                className="group flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-gray-900">{link.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium flex-shrink-0">
                      {link.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2 mt-1">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600 mt-1" />
              </Link>
            ))}
          </div>
        )}

        {/* Content result cards (products) */}
        {content.length > 0 && !websiteLinks.length && (
          <div className="flex w-full flex-col gap-2">
            {content.slice(0, 5).map((item, idx) => (
              <Link
                key={`content-${idx}`}
                href={item.url}
                className="group flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-900">{item.title}</p>
                  {item.description && (
                    <p className="text-[11px] text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  {item.price && (
                    <p className="text-[11px] font-medium text-blue-600 mt-1">${item.price.toLocaleString()}</p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600 mt-0.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
