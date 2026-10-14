import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin-auth"
import { ChatInbox } from "@/components/admin/chat-inbox"

export const dynamic = "force-dynamic"
export const metadata = { title: "Live Chat | AUAPW Admin", robots: { index: false } }

export default async function AdminChatsPage() {
  if (!(await getAdminSession())) redirect("/admin/login")

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Live Chat</h1>
        <p className="text-sm text-muted-foreground">
          Conversations started from the chat bubble on the website. New chats also email the follow-up inbox.
        </p>
      </header>
      <Suspense fallback={null}>
        <ChatInbox />
      </Suspense>
    </div>
  )
}
