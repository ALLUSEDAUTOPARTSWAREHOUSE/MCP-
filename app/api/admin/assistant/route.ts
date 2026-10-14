import { createAgentUIStreamResponse } from "ai"
import { getAdminSession } from "@/lib/admin-auth"
import { adminAssistant } from "@/lib/admin-assistant"

export const maxDuration = 60

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { messages } = await request.json()
  if (!Array.isArray(messages)) {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  return createAgentUIStreamResponse({
    agent: adminAssistant,
    uiMessages: messages.slice(-40),
  })
}
