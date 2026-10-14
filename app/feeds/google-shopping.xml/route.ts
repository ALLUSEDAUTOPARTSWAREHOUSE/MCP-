import { after } from "next/server"
import { BRAND_DIRECTORY, loadBrandCatalog } from "@/lib/brand-catalog"
import { getPartType } from "@/lib/catalog-fields"
import {
  MERCHANT_STORE_NAME,
  SITE_URL,
  feedItemId,
  getAllOverrides,
  getEffectiveProduct,
  isFeedEligible,
  logFeedFetch,
} from "@/lib/merchant"

export const dynamic = "force-dynamic"
export const maxDuration = 300

const CATEGORY = {
  engine: "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts > Motor Vehicle Engine Parts",
  transmission:
    "Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts > Motor Vehicle Transmission & Drivetrain Parts",
} as const

function xml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const brandFilter = url.searchParams.get("brand")
  const brands = brandFilter ? BRAND_DIRECTORY.filter((b) => b.slug === brandFilter) : BRAND_DIRECTORY
  if (brandFilter && brands.length === 0) return new Response("Unknown brand", { status: 404 })

  let overrides: Awaited<ReturnType<typeof getAllOverrides>>
  try {
    overrides = await getAllOverrides()
  } catch {
    overrides = new Map()
  }

  after(() => logFeedFetch(request.headers.get("user-agent"), brandFilter))

  const encoder = new TextEncoder()
  let index = 0

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n` +
            `<title>${xml(MERCHANT_STORE_NAME)}</title>\n<link>${SITE_URL}</link>\n` +
            `<description>Tested used OEM engines and transmissions with free insured freight.</description>\n`,
        ),
      )
    },
    pull(controller) {
      const brand = brands[index++]
      if (!brand) {
        controller.enqueue(encoder.encode("</channel>\n</rss>\n"))
        controller.close()
        return
      }

      const catalog = loadBrandCatalog(brand.slug)
      const chunk: string[] = []
      for (const product of catalog?.products ?? []) {
        const effective = getEffectiveProduct(
          brand.slug,
          product,
          overrides.get(`${brand.slug}/${product.canonicalSlug}`) ?? null,
        )
        if (!isFeedEligible(effective)) continue

        const partType = getPartType(product)
        const productType = `Used ${partType === "engine" ? "Engines" : "Transmissions"} > ${brand.label}${product.model ? ` > ${product.model}` : ""}`
        chunk.push(
          `<item>` +
            `<g:id>${feedItemId(brand.slug, product.canonicalSlug)}</g:id>` +
            `<title>${xml(effective.title.slice(0, 150))}</title>` +
            `<description>${xml(effective.description.slice(0, 5000))}</description>` +
            `<link>${xml(effective.url)}</link>` +
            `<g:image_link>${xml(effective.imageUrl)}</g:image_link>` +
            `<g:condition>used</g:condition>` +
            `<g:availability>${effective.availability}</g:availability>` +
            `<g:price>${effective.price!.toFixed(2)} USD</g:price>` +
            `<g:brand>${xml(brand.label)}</g:brand>` +
            `<g:identifier_exists>no</g:identifier_exists>` +
            `<g:google_product_category>${xml(CATEGORY[partType])}</g:google_product_category>` +
            `<g:product_type>${xml(productType)}</g:product_type>` +
            `<g:shipping><g:country>US</g:country><g:price>0.00 USD</g:price></g:shipping>` +
            `<g:custom_label_0>${xml(brand.label)}</g:custom_label_0>` +
            `<g:custom_label_1>${partType}</g:custom_label_1>` +
            `</item>\n`,
        )
      }
      if (chunk.length) controller.enqueue(encoder.encode(chunk.join("")))
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  })
}
