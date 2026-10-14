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
`)

console.log("product_overrides and merchant_feed_fetches ready")
await client.end()
