import { NextResponse, type NextRequest } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { listConversations, type ChatStatus } from "@/lib/live-chat"

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const raw = req.nextUrl.searchParams.get("status")
  const status: ChatStatus | "all" = raw === "closed" || raw === "all" ? raw : "open"
  const conversations = await listConversations(status)
  return NextResponse.json({ conversations })
}
