import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function main() {
  console.log('[v0] Altering payment_gateways table...')

  await sql`ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS "instructions" text`
  await sql`ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS "paymentLink" text`
  await sql`ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS "envVarsRequired" json DEFAULT '[]'::json`

  console.log('[v0] Columns ensured. Seeding additional presets...')

  const presets = [
    {
      id: 'gtw_google_pay',
      name: 'Google Pay',
      slug: 'google_pay',
      type: 'wallet',
      description: 'Fast, secure checkout using a saved Google Pay card.',
      isEnabled: false,
      isDefault: false,
      sortOrder: 20,
      envVarsRequired: JSON.stringify(['GOOGLE_PAY_MERCHANT_ID']),
    },
    {
      id: 'gtw_apple_pay',
      name: 'Apple Pay',
      slug: 'apple_pay',
      type: 'wallet',
      description: 'Fast, secure checkout using Face ID, Touch ID, or passcode.',
      isEnabled: false,
      isDefault: false,
      sortOrder: 21,
      envVarsRequired: JSON.stringify(['APPLE_PAY_MERCHANT_ID']),
    },
    {
      id: 'gtw_venmo',
      name: 'Venmo',
      slug: 'venmo',
      type: 'wallet',
      description: 'Pay directly from your Venmo balance or linked card.',
      isEnabled: false,
      isDefault: false,
      sortOrder: 22,
      envVarsRequired: JSON.stringify([]),
    },
    {
      id: 'gtw_wire_transfer',
      name: 'Wire Transfer',
      slug: 'wire_transfer',
      type: 'bank',
      description: 'Pay directly from your bank account via wire transfer.',
      isEnabled: false,
      isDefault: false,
      sortOrder: 30,
      instructions:
        'Our team will email wire instructions (bank name, routing number, account number) after checkout. Orders ship once funds are confirmed.',
      envVarsRequired: JSON.stringify([]),
    },
    {
      id: 'gtw_payment_link',
      name: 'Payment Link',
      slug: 'payment_link',
      type: 'link',
      description: 'Pay via a secure hosted payment link (supports EPS and other local methods).',
      isEnabled: false,
      isDefault: false,
      sortOrder: 31,
      paymentLink: '',
      envVarsRequired: JSON.stringify([]),
    },
  ]

  for (const preset of presets) {
    await sql`
      INSERT INTO payment_gateways (id, name, slug, type, description, "isEnabled", "isDefault", "sortOrder", instructions, "paymentLink", "envVarsRequired")
      VALUES (
        ${preset.id}, ${preset.name}, ${preset.slug}, ${preset.type}, ${preset.description},
        ${preset.isEnabled}, ${preset.isDefault}, ${preset.sortOrder},
        ${preset.instructions ?? null}, ${preset.paymentLink ?? null}, ${preset.envVarsRequired}
      )
      ON CONFLICT (slug) DO NOTHING
    `
  }

  console.log('[v0] Payment gateway presets seeded.')
}

main()
  .then(() => {
    console.log('[v0] Migration complete.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[v0] Migration failed:', err)
    process.exit(1)
  })
