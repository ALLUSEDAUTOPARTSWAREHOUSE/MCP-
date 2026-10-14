import { randomUUID } from "crypto"
import { after, NextResponse, type NextRequest } from "next/server"
import {
  addCustomerMessage,
  CHAT_GUEST_COOKIE,
  cleanBody,
  cleanOptional,
  getOpenConversationForGuest,
  listMessages,
  markReadBy,
} from "@/lib/live-chat"
import { notifyNewChat } from "@/lib/followup-notify"

const GUEST_ID_RE = /^[0-9a-f-]{36}$/i
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function readGuestId(req: NextRequest) {
  const v = req.cookies.get(CHAT_GUEST_COOKIE)?.value
  return v && GUEST_ID_RE.test(v) ? v : null
}

export async function GET(req: NextRequest) {
  const guestId = readGuestId(req)
  if (!guestId) return NextResponse.json({ conversation: null, messages: [] })

  const conversation = await getOpenConversationForGuest(guestId)
  if (!conversation) return NextResponse.json({ conversation: null, messages: [] })

  const messages = await listMessages(conversation.id)
  if (req.nextUrl.searchParams.get("markRead") === "1" && conversation.unreadForCustomer) {
    await markReadBy(conversation.id, "customer")
  }
  return NextResponse.json({
    conversation: {
      id: conversation.id,
      customerName: conversation.customerName,
      customerEmail: conversation.customerEmail,
      unreadForCustomer: conversation.unreadForCustomer,
    },
    messages,
  })
}

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const body = cleanBody(payload.body)
  if (!body) return NextResponse.json({ error: "Message is required" }, { status: 400 })

  const email = cleanOptional(payload.email, 200)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 })
  }
  const name = cleanOptional(payload.name, 120)
  const pageUrl = cleanOptional(payload.pageUrl, 500)

  const existingGuestId = readGuestId(req)
  const guestId = existingGuestId ?? randomUUID()

  const result = await addCustomerMessage({ guestId, body, name, email, pageUrl })

  if (result.isNew) {
    const siteUrl = req.nextUrl.origin
    after(() => notifyNewChat({ conversationId: result.conversationId, name, email, pageUrl, body }, siteUrl))
  }

  const res = NextResponse.json({ ok: true, conversationId: result.conversationId })
  if (!existingGuestId) {
    res.cookies.set(CHAT_GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    })
  }
  return res
}
