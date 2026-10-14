import { NextResponse, type NextRequest } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import {
  addAdminReply,
  cleanBody,
  getConversation,
  listMessages,
  markReadBy,
  setConversationStatus,
} from "@/lib/live-chat"

type Ctx = { params: Promise<{ id: string }> }

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 })

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await getAdminSession())) return unauthorized()
  const { id } = await params
  const conversation = await getConversation(id)
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const messages = await listMessages(id)
  if (conversation.unreadForAdmin) await markReadBy(id, "admin")
  return NextResponse.json({ conversation, messages })
}

export async function POST(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminSession())) return unauthorized()
  const { id } = await params
  const payload = await req.json().catch(() => ({}))
  const body = cleanBody((payload as Record<string, unknown>).body)
  if (!body) return NextResponse.json({ error: "Message is required" }, { status: 400 })
  const ok = await addAdminReply(id, body)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminSession())) return unauthorized()
  const { id } = await params
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const status = payload.status === "closed" ? "closed" : payload.status === "open" ? "open" : null
  if (!status) return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  if (!(await getConversation(id))) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await setConversationStatus(id, status)
  return NextResponse.json({ ok: true })
}
