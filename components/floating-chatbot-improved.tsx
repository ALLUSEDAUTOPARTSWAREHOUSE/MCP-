'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface EmailCaptureState {
  stage: 'none' | 'form' | 'verifying' | 'verified'
  email: string
  error?: string
  loading?: boolean
  token?: string
}

export function FloatingChatbotImproved() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [startTime] = useState<Date>(new Date())
  const [emailCapture, setEmailCapture] = useState<EmailCaptureState>({
    stage: 'none',
    email: '',
  })
  const [conversationTime, setConversationTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageCountRef = useRef(0)

  // Auto-show email capture after 30 seconds or 3 messages
  useEffect(() => {
    if (!isOpen) return

    const checkEmailCapture = () => {
      const elapsed = Math.round((Date.now() - startTime.getTime()) / 1000)
      setConversationTime(elapsed)

      if (
        (elapsed >= 30 || messageCountRef.current >= 3) &&
        emailCapture.stage === 'none'
      ) {
        setEmailCapture((prev) => ({ ...prev, stage: 'form' }))
      }
    }

    const interval = setInterval(checkEmailCapture, 1000)
    return () => clearInterval(interval)
  }, [isOpen, startTime, emailCapture.stage])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: 'Hello! Welcome to AUAPW. How can I help you find the perfect auto parts today?',
            timestamp: new Date(),
          },
        ])
      }, 300)
    }
  }, [isOpen, messages.length])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    messageCountRef.current += 1
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: input,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'I apologize, I could not process that request.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailCapture.email.trim()) return

    setEmailCapture((prev) => ({ ...prev, loading: true, error: undefined }))

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-code',
          email: emailCapture.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmailCapture((prev) => ({
          ...prev,
          stage: 'verifying',
          token: data.token,
          loading: false,
        }))
      } else {
        setEmailCapture((prev) => ({
          ...prev,
          error: data.error || 'Failed to send verification',
          loading: false,
        }))
      }
    } catch (error) {
      setEmailCapture((prev) => ({
        ...prev,
        error: 'Connection error. Please try again.',
        loading: false,
      }))
    }
  }

  const handleVerifyEmail = async () => {
    if (!emailCapture.token) return

    setEmailCapture((prev) => ({ ...prev, loading: true, error: undefined }))

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-token',
          token: emailCapture.token,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmailCapture((prev) => ({
          ...prev,
          stage: 'verified',
          loading: false,
        }))

        // Send conversation to support
        const endTime = new Date()
        await fetch('/api/send-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: emailCapture.email,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            duration: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
            timestamp: endTime.toISOString(),
          }),
        })
      } else {
        setEmailCapture((prev) => ({
          ...prev,
          error: data.error || 'Verification failed',
          loading: false,
        }))
      }
    } catch (error) {
      setEmailCapture((prev) => ({
        ...prev,
        error: 'Verification error. Please try again.',
        loading: false,
      }))
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg hover:from-slate-700 hover:to-slate-800 transition-all hover:scale-110 flex items-center justify-center z-40 border border-slate-500"
          title="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm">AUAPW Chatbot</h2>
              <p className="text-xs opacity-90">We're here to help!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-600 rounded transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 border border-slate-200 px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Email Capture Section */}
          {emailCapture.stage !== 'none' && (
            <div className="border-t border-slate-200 bg-blue-50 p-4">
              {emailCapture.stage === 'form' && (
                <form onSubmit={handleEmailSubmit} className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Continue the conversation via email
                  </label>
                  <input
                    type="email"
                    value={emailCapture.email}
                    onChange={(e) =>
                      setEmailCapture((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                  {emailCapture.error && (
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {emailCapture.error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={emailCapture.loading}
                    className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-slate-400 transition"
                  >
                    {emailCapture.loading ? 'Sending...' : 'Continue'}
                  </button>
                </form>
              )}

              {emailCapture.stage === 'verifying' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Verification code sent to <strong>{emailCapture.email}</strong>
                  </p>
                  {emailCapture.error && (
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {emailCapture.error}
                    </p>
                  )}
                  <button
                    onClick={handleVerifyEmail}
                    disabled={emailCapture.loading}
                    className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-slate-400 transition"
                  >
                    {emailCapture.loading ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>
              )}

              {emailCapture.stage === 'verified' && (
                <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-2 rounded">
                  <CheckCircle2 className="h-5 w-5" />
                  <div className="text-xs">
                    <p className="font-semibold">Email verified!</p>
                    <p>We'll be in touch soon.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          {emailCapture.stage !== 'verified' && (
            <div className="border-t border-slate-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about parts..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-slate-400 transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  )
}
