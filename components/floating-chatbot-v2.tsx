'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare, X, Send, CheckCircle, Loader2, User, Bot } from 'lucide-react'
import { useChat } from '@ai-sdk/react'

interface WebsiteLink {
  title: string
  description: string
  url: string
  category: 'product' | 'guide' | 'policy' | 'service' | 'tool' | 'category'
}

const SUGGESTIONS = [
  "What Acura parts are available?",
  "How much is shipping?",
  "Tell me about warranty coverage",
  "Help me find an engine",
  "What's your return policy?",
  "Browse transmission parts",
  "How do I request a quote?",
  "Contact customer support",
]

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === 'user'

  // Collect website links from tool outputs
  const websiteLinks: WebsiteLink[] = []

  for (const part of message.parts ?? []) {
    if (
      typeof part.type === 'string' &&
      part.type.startsWith('tool-') &&
      part.state === 'output-available' &&
      part.output
    ) {
      if (part.type === 'tool-searchWebsite' && part.output.pages) {
        for (const page of part.output.pages) {
          websiteLinks.push(page)
        }
      } else if (part.output.parts) {
        for (const p of part.output.parts) {
          websiteLinks.push({
            title: p.name,
            description: p.category ? `${p.category}${p.year ? ` - ${p.year}` : ''}` : undefined || '',
            url: p.url,
            category: 'product',
          })
        }
      }
    }
  }

  const textContent = (message.parts ?? [])
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('')

  return (
    <div className={`flex gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
      }`}>
        {isUser ? <User className='w-4 h-4' /> : <Bot className='w-4 h-4' />}
      </div>

      <div className={`flex max-w-[calc(100%-32px)] flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {textContent && (
          <div
            className={`rounded-xl px-3.5 py-2 text-sm leading-relaxed max-w-full ${
              isUser
                ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
            }`}
          >
            {textContent}
          </div>
        )}

        {/* Website links with improved styling */}
        {websiteLinks.length > 0 && (
          <div className='flex flex-col gap-2 w-full'>
            {websiteLinks.slice(0, 3).map((link, idx) => (
              <Link
                key={`website-${idx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className='group flex items-start gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-left transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 w-full'
              >
                <div className='flex-shrink-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-400 rounded-full' />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='truncate text-xs font-semibold text-gray-900 dark:text-white'>{link.title}</p>
                    <span className='text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium flex-shrink-0 whitespace-nowrap'>
                      {link.category}
                    </span>
                  </div>
                  <p className='text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2 mt-1'>{link.description}</p>
                </div>
                <ArrowRight className='h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all mt-0.5' />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmailForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setVerifying(true)
    try {
      // Verify email before sending
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSubmitted(true)
        onSubmit(email)
        setTimeout(() => {
          setSubmitted(false)
          setEmail('')
          setVerifying(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Email verification failed:', error)
      setVerifying(false)
    }
  }

  if (submitted) {
    return (
      <div className='mx-3 mb-3 flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 dark:border-emerald-500/20 rounded-lg text-sm text-emerald-700 dark:text-emerald-400'>
        <CheckCircle className='h-4 w-4 flex-shrink-0' />
        <span className='font-medium'>Email verified! We&apos;ll follow up soon.</span>
      </div>
    )
  }

  return (
    <div className='px-3 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-t border-gray-200 dark:border-gray-700'>
      <p className='text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2'>Continue conversation via email:</p>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='your@email.com'
          className='flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400'
          required
        />
        <button
          type='submit'
          disabled={verifying || !email.includes('@')}
          className='px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5'
        >
          {verifying ? (
            <>
              <Loader2 className='h-3 w-3 animate-spin' />
              <span>Verifying</span>
            </>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  )
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const messageCountRef = useRef(0)

  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show email form after 30 seconds or after 3 messages
  useEffect(() => {
    if (!isOpen || emailSubmitted || showEmailForm) return

    messageCountRef.current = messages.filter((m) => m.role === 'user').length

    // Start 30-second timer on first message
    if (messageCountRef.current === 1 && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        setShowEmailForm(true)
        timerRef.current = null
      }, 30000)
    }

    // Show after 3 user messages
    if (messageCountRef.current >= 3) {
      setShowEmailForm(true)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [messages, isOpen, emailSubmitted, showEmailForm])

  const handleEmailSubmit = (email: string) => {
    setEmailSubmitted(true)
    // Send conversation to support email
    fetch('/api/send-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    }).catch((error) => console.error('Failed to send conversation:', error))
  }

  const handleChatSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleChatSubmit(e)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl ${
          isOpen
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:scale-110 hover:shadow-xl'
        }`}
      >
        <MessageSquare className='h-5 w-5' />
        <span className='hidden sm:inline'>AUAPW Support</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className='fixed bottom-24 right-6 z-50 w-96 max-h-[600px] flex flex-col bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden'
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 text-white px-4 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                <MessageSquare className='h-5 w-5' />
              </div>
              <div>
                <h3 className='font-bold text-sm'>AUAPW Assistant</h3>
                <p className='text-xs text-white/80'>Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='hover:bg-white/20 p-1.5 rounded-lg transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Messages Area */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full gap-4 text-center px-4'>
                <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center'>
                  <MessageSquare className='h-8 w-8 text-blue-600 dark:text-blue-300' />
                </div>
                <div>
                  <p className='text-sm font-bold text-gray-900 dark:text-white'>Welcome to AUAPW!</p>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed'>
                    Ask me about parts, pricing, shipping, warranty, or any questions about AUAPW.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <MessageBubble key={idx} message={message} />
                ))}
                {isLoading && (
                  <div className='flex items-center gap-2 ml-8'>
                    <div className='w-2 h-2 rounded-full bg-blue-500 animate-bounce' style={{ animationDelay: '0ms' }} />
                    <div className='w-2 h-2 rounded-full bg-blue-400 animate-bounce' style={{ animationDelay: '150ms' }} />
                    <div className='w-2 h-2 rounded-full bg-blue-300 animate-bounce' style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Email Form */}
          {showEmailForm && !emailSubmitted && <EmailForm onSubmit={handleEmailSubmit} />}

          {/* Suggestions or Input */}
          {messages.length === 0 ? (
            <div className='px-3 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-2'>
              {SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const form = new FormData()
                    form.append('input', suggestion)
                    handleChatSubmit2({ target: { elements: { input: { value: suggestion } } } } as any)
                  }}
                  className='w-full text-left px-3 py-2 text-xs rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 transition-colors border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 font-medium'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleChatSubmit2} className='px-3 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex gap-2'>
              <input
                value={input}
                onChange={handleInputChange}
                placeholder='Ask a question...'
                className='flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400'
                disabled={isLoading}
              />
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
              >
                <Send className='h-4 w-4' />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
