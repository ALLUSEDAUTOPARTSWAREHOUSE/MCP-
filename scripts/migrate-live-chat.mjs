import pg from "pg"

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id text PRIMARY KEY,
    guest_id text NOT NULL,
    customer_name text,
    customer_email text,
    page_url text,
    status text NOT NULL DEFAULT 'open',
    unread_for_admin boolean NOT NULL DEFAULT true,
    unread_for_customer boolean NOT NULL DEFAULT false,
    last_message_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS public.chat_messages (
    id text PRIMARY KEY,
    conversation_id text NOT NULL,
    sender text NOT NULL CHECK (sender IN ('customer', 'admin')),
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS chat_conversations_guest_idx ON public.chat_conversations (guest_id, status);
  CREATE INDEX IF NOT EXISTS chat_conversations_last_idx ON public.chat_conversations (status, last_message_at DESC);
  CREATE INDEX IF NOT EXISTS chat_messages_conversation_idx ON public.chat_messages (conversation_id, created_at);
`)

console.log("Live chat tables ready")
await client.end()
