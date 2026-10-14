'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatConversation, ChatMessage } from '@/lib/live-chat'

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

const time = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

type Filter = 'open' | 'closed' | 'all'

export function ChatInbox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('c')
  const [filter, setFilter] = useState<Filter>('open')

  const { data: list, mutate: refreshList } = useSWR<{ conversations: ChatConversation[] }>(
    `/api/admin/chats?status=${filter}`,
    fetcher,
    { refreshInterval: 5000 },
  )
  const conversations = list?.conversations ?? []

  function select(id: string) {
    router.replace(`/admin/chats?c=${encodeURIComponent(id)}`, { scroll: false })
  }

  return (
    <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[20rem_1fr]">
      <aside className="flex flex-col border-b border-border md:border-b-0 md:border-r">
        <div className="flex gap-1 border-b border-border p-2" role="tablist" aria-label="Conversation filter">
          {(['open', 'closed', 'all'] as const).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize',
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <ul className="max-h-[70vh] flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <li className="p-4 text-sm text-muted-foreground">No {filter === 'all' ? '' : filter} conversations.</li>
          ) : (
            conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => select(c.id)}
                  className={cn(
                    'flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left hover:bg-muted/60',
                    selectedId === c.id && 'bg-muted',
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn('truncate text-sm', c.unreadForAdmin ? 'font-bold' : 'font-medium')}>
                      {c.customerName || c.customerEmail || 'Website visitor'}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{time(c.lastMessageAt)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {c.unreadForAdmin ? (
                      <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                    ) : null}
                    <span className="truncate text-xs text-muted-foreground">{c.lastMessage}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      {selectedId ? (
        <ChatThread key={selectedId} id={selectedId} onChanged={() => refreshList()} />
      ) : (
        <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
          Select a conversation to reply.
        </div>
      )}
    </div>
  )
}

function ChatThread({ id, onChanged }: { id: string; onChanged: () => void }) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { data, mutate } = useSWR<{ conversation: ChatConversation; messages: ChatMessage[] }>(
    `/api/admin/chats/${encodeURIComponent(id)}`,
    fetcher,
    { refreshInterval: 4000 },
  )
  const messages = data?.messages ?? []
  const conversation = data?.conversation

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length])

  async function reply(e?: FormEvent) {
    e?.preventDefault()
    const body = draft.trim()
    if (!body || sending) return
    setSending(true)
    setError(null)
    const res = await fetch(`/api/admin/chats/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    setSending(false)
    if (!res.ok) {
      setError('Reply failed. Try again.')
      return
    }
    setDraft('')
    await mutate()
    onChanged()
  }

  async function toggleStatus() {
    if (!conversation) return
    await fetch(`/api/admin/chats/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: conversation.status === 'open' ? 'closed' : 'open' }),
    })
    await mutate()
    onChanged()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      void reply()
    }
  }

  return (
    <section className="flex min-h-[70vh] flex-col" aria-label="Conversation">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-sm font-bold text-foreground">
            {conversation?.customerName || 'Website visitor'}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {[conversation?.customerEmail, conversation?.pageUrl].filter(Boolean).join(' · ') || 'No contact info'}
          </p>
        </div>
        {conversation ? (
          <button
            onClick={toggleStatus}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            {conversation.status === 'open' ? 'Close chat' : 'Reopen chat'}
          </button>
        ) : null}
      </header>

      <div ref={listRef} className="flex max-h-[55vh] flex-1 flex-col gap-2 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm',
              m.sender === 'admin' ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-muted text-foreground',
            )}
          >
            <span className="whitespace-pre-wrap break-words">{m.body}</span>
            <span className="text-[10px] opacity-70">{time(m.createdAt)}</span>
          </div>
        ))}
      </div>

      <form onSubmit={reply} className="flex flex-col gap-2 border-t border-border p-3">
        {error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}
        <div className="flex items-end gap-2">
          <label htmlFor="admin-chat-reply" className="sr-only">Reply</label>
          <textarea
            id="admin-chat-reply"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            maxLength={2000}
            placeholder="Write a reply… (Enter to send, Shift+Enter for new line)"
            className="min-h-10 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Send className="size-4" />
            Send
          </button>
        </div>
      </form>
    </section>
  )
}
