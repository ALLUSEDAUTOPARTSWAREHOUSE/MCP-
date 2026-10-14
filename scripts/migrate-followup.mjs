import pg from "pg"

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

await client.query(`
  ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS zip text,
    ADD COLUMN IF NOT EXISTS state text,
    ADD COLUMN IF NOT EXISTS part_option text;

  ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS customer_name text,
    ADD COLUMN IF NOT EXISTS customer_email text,
    ADD COLUMN IF NOT EXISTS customer_phone text,
    ADD COLUMN IF NOT EXISTS customer_notes text,
    ADD COLUMN IF NOT EXISTS internal_notes text;

  CREATE INDEX IF NOT EXISTS leads_status_created_idx ON public.leads (status, created_at DESC);
  CREATE INDEX IF NOT EXISTS orders_status_created_idx ON public.orders (status, createdat DESC);
  CREATE UNIQUE INDEX IF NOT EXISTS orders_ordernumber_key ON public.orders (ordernumber);
`)

console.log("Follow-up columns ready on public.leads and public.orders")
await client.end()
