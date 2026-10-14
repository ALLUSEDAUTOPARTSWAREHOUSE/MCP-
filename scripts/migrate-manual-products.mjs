import pg from "pg"

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS public.manual_products (
    id serial PRIMARY KEY,
    brand text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10, 2),
    image_url text,
    category text,
    model text,
    year text,
    source text NOT NULL DEFAULT 'manual',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (brand, slug)
  );

  CREATE INDEX IF NOT EXISTS manual_products_brand_idx ON public.manual_products (brand);
`)

console.log("manual_products ready")
await client.end()
