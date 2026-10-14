import pg from "pg"

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS public.product_overrides (
    brand text NOT NULL,
    slug text NOT NULL,
    title text,
    description text,
    price numeric(10, 2),
    image_url text,
    availability text,
    hidden boolean NOT NULL DEFAULT false,
    exclude_from_feed boolean NOT NULL DEFAULT false,
    notes text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (brand, slug)
  );

  CREATE TABLE IF NOT EXISTS public.merchant_feed_fetches (
    id serial PRIMARY KEY,
    fetched_at timestamptz NOT NULL DEFAULT now(),
    user_agent text,
    brand text,
    is_google boolean NOT NULL DEFAULT false
  );

  CREATE INDEX IF NOT EXISTS merchant_feed_fetches_time_idx ON public.merchant_feed_fetches (fetched_at DESC);

  -- Written by the daily cron (lib/merchant-health.ts creates it on first run too).
  CREATE TABLE IF NOT EXISTS public.merchant_feed_snapshots (
    day date PRIMARY KEY,
    taken_at timestamptz NOT NULL DEFAULT now(),
    total integer NOT NULL,
    eligible integer NOT NULL,
    brands jsonb NOT NULL,
    alerts jsonb NOT NULL
  );
`)

console.log("product_overrides, merchant_feed_fetches and merchant_feed_snapshots ready")
await client.end()
