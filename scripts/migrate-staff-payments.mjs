import pg from "pg"

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS public.staff_members (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text,
    "role" text NOT NULL,
    "department" text,
    "title" text,
    "status" text NOT NULL DEFAULT 'active',
    "notes" text,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS staff_members_role_idx ON public.staff_members ("role");

  CREATE TABLE IF NOT EXISTS public.payment_gateways (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "type" text NOT NULL DEFAULT 'card',
    "description" text,
    "logo" text,
    "isEnabled" boolean NOT NULL DEFAULT false,
    "isDefault" boolean NOT NULL DEFAULT false,
    "sortOrder" integer NOT NULL DEFAULT 0,
    "config" jsonb,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now()
  );
`)

// Seed default gateway catalog if empty
const { rows } = await client.query(`SELECT COUNT(*)::int AS count FROM public.payment_gateways`)
if (rows[0].count === 0) {
  const now = new Date().toISOString()
  const defaults = [
    {
      id: "gtw_authorize_net",
      name: "Authorize.Net",
      slug: "authorize_net",
      type: "card",
      description: "Secure card payment gateway. Industry-standard encryption and fraud detection.",
      isEnabled: true,
      isDefault: true,
      sortOrder: 1,
      config: { acceptedCards: ["visa", "mastercard", "amex", "discover"] },
    },
    {
      id: "gtw_stripe",
      name: "Stripe",
      slug: "stripe",
      type: "card",
      description: "Pay securely with major credit or debit cards via Stripe.",
      isEnabled: false,
      isDefault: false,
      sortOrder: 2,
      config: { acceptedCards: ["visa", "mastercard", "amex", "discover"] },
    },
    {
      id: "gtw_paypal",
      name: "PayPal",
      slug: "paypal",
      type: "wallet",
      description: "Pay using your PayPal balance, bank, or linked card.",
      isEnabled: false,
      isDefault: false,
      sortOrder: 3,
      config: {},
    },
    {
      id: "gtw_phone",
      name: "Pay by Phone",
      slug: "phone",
      type: "offline",
      description: "A parts specialist calls to securely confirm fitment and take payment.",
      isEnabled: true,
      isDefault: false,
      sortOrder: 4,
      config: {},
    },
  ]

  for (const g of defaults) {
    await client.query(
      `INSERT INTO public.payment_gateways
        ("id","name","slug","type","description","isEnabled","isDefault","sortOrder","config","createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10)
       ON CONFLICT ("slug") DO NOTHING`,
      [g.id, g.name, g.slug, g.type, g.description, g.isEnabled, g.isDefault, g.sortOrder, g.config, now]
    )
  }
}

console.log("staff_members and payment_gateways tables ready (with seeded gateway defaults)")
await client.end()
