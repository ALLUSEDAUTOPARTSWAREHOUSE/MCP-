import 'server-only'

import { headers } from 'next/headers'
import {
  getToken,
  startAuthorization,
  UserAuthorizationRequiredError,
  type ConnectTokenSubject,
} from '@vercel/connect'
import { getProductPartsUrl, type CatalogProduct } from '@/lib/products-catalog'
import { getCatalogProducts } from '@/lib/catalog-source'

const CONNECTOR_UID = 'google/google-merchant-center-product-sync-2'
const MERCHANT_ACCOUNT_ID = '5828832429'
const PRODUCTS_API = 'https://merchantapi.googleapis.com/products/v1beta'
const DATASOURCES_API = 'https://merchantapi.googleapis.com/datasources/v1beta'
const CONTENT_SCOPE = 'https://www.googleapis.com/auth/content'
const DATA_SOURCE_NAME = 'AUAPW Website Catalog'

export type MerchantSyncResult = {
  synced: number
  removed: number
  failed: Array<{ sku: string; error: string }>
  authorizationUrl?: string
  prerequisite?: string
}

/**
 * Resolve an origin that works in production, Vercel previews, and the v0
 * preview iframe. Used for both provider product links and the Connect
 * callback URL.
 */
async function getOrigin(): Promise<string> {
  if (process.env.NODE_ENV !== 'production' && process.env.V0_RUNTIME_URL)
    return process.env.V0_RUNTIME_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  return `${h.get('x-forwarded-proto') ?? 'https'}://${host}`
}

function getSubject(userId: string): ConnectTokenSubject {
  return { type: 'user', id: userId, issuer: 'better-auth' }
}

function productInput(product: CatalogProduct, origin: string) {
  return {
    offerId: product.sku,
    contentLanguage: 'en',
    feedLabel: 'US',
    attributes: {
      title: product.name,
      description: product.description,
      link: `${origin}${getProductPartsUrl(product)}`,
      imageLink: `${origin}${product.image}`,
      availability: product.inStock ? 'in stock' : 'out of stock',
      condition: 'used',
      brand: 'AUAPW',
      price: {
        amountMicros: String(Math.round(product.price * 1_000_000)),
        currencyCode: 'USD',
      },
      productTypes: [product.category],
      customAttributes: [{ name: 'fits', value: product.fits }],
    },
  }
}

async function resolveToken(userId: string, origin: string) {
  const params = { subject: getSubject(userId), scopes: [CONTENT_SCOPE] }
  try {
    return { token: await getToken(CONNECTOR_UID, params) }
  } catch (error) {
    if (error instanceof UserAuthorizationRequiredError) {
      const authorization = await startAuthorization(CONNECTOR_UID, params, {
        callbackUrl: `${origin}/api/admin/merchant-center/callback`,
      })
      return { token: null as string | null, authorizationUrl: authorization.url }
    }
    throw error
  }
}

/**
 * Find an existing primary product data source for the account, or create an
 * API data source if none exists. Returns the full resource name used as the
 * `dataSource` query parameter on product inserts.
 */
async function resolvePrimaryDataSource(token: string): Promise<string> {
  const listRes = await fetch(
    `${DATASOURCES_API}/accounts/${MERCHANT_ACCOUNT_ID}/dataSources`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (listRes.ok) {
    const data = (await listRes.json()) as {
      dataSources?: Array<{ name: string; primaryProductDataSource?: unknown }>
    }
    const primary = data.dataSources?.find((source) => source.primaryProductDataSource)
    if (primary?.name) return primary.name
  }

  const createRes = await fetch(
    `${DATASOURCES_API}/accounts/${MERCHANT_ACCOUNT_ID}/dataSources`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: DATA_SOURCE_NAME,
        primaryProductDataSource: {
          contentLanguage: 'en',
          feedLabel: 'US',
          countries: ['US'],
        },
      }),
    },
  )
  if (!createRes.ok) {
    throw new Error(`data source setup failed: ${(await createRes.text()).slice(0, 300)}`)
  }
  const created = (await createRes.json()) as { name: string }
  return created.name
}

/**
 * List every product currently in the Merchant Center account, following
 * pagination. Returns a map of offerId (SKU) -> product resource name so we
 * can delete the ones the portal no longer publishes.
 */
async function listMerchantProducts(token: string): Promise<Map<string, string>> {
  const byOffer = new Map<string, string>()
  let pageToken: string | undefined
  do {
    const url = new URL(`${PRODUCTS_API}/accounts/${MERCHANT_ACCOUNT_ID}/products`)
    url.searchParams.set('pageSize', '250')
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!response.ok) break
    const data = (await response.json()) as {
      products?: Array<{ name: string; offerId?: string }>
      nextPageToken?: string
    }
    for (const product of data.products ?? []) {
      if (product.offerId) byOffer.set(product.offerId, product.name)
    }
    pageToken = data.nextPageToken
  } while (pageToken)
  return byOffer
}

export async function syncCatalogToMerchantCenter(userId: string): Promise<MerchantSyncResult> {
  const origin = await getOrigin()
  const auth = await resolveToken(userId, origin)
  if (!auth.token) return { synced: 0, removed: 0, failed: [], authorizationUrl: auth.authorizationUrl }

  const result: MerchantSyncResult = { synced: 0, removed: 0, failed: [] }

  let dataSource: string
  try {
    dataSource = await resolvePrimaryDataSource(auth.token)
  } catch (error) {
    return {
      synced: 0,
      removed: 0,
      failed: [],
      prerequisite:
        error instanceof Error
          ? error.message
          : 'Could not resolve a Merchant Center data source.',
    }
  }

  const catalog: CatalogProduct[] = await getCatalogProducts()
  const publishable = catalog.filter((item) => item.inStock)
  const publishableSkus = new Set(publishable.map((item) => item.sku))

  // Upsert every in-stock product (insert is an upsert keyed by offerId).
  for (const product of publishable) {
    const response = await fetch(
      `${PRODUCTS_API}/accounts/${MERCHANT_ACCOUNT_ID}/productInputs:insert?dataSource=${encodeURIComponent(dataSource)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productInput(product, origin)),
      },
    )
    if (response.ok) {
      result.synced += 1
    } else {
      const body = await response.text()
      result.failed.push({ sku: product.sku, error: body.slice(0, 500) })
    }
  }

  // Reconcile: remove products from Google that are no longer publishable in
  // the portal (deleted or marked out of stock).
  const existing = await listMerchantProducts(auth.token)
  for (const [offerId, resourceName] of existing) {
    if (publishableSkus.has(offerId)) continue
    // Deletes go through the writable productInputs resource with the data source.
    const productInputName = resourceName.replace('/products/', '/productInputs/')
    const response = await fetch(
      `${PRODUCTS_API}/${productInputName}?dataSource=${encodeURIComponent(dataSource)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      },
    )
    if (response.ok || response.status === 404) {
      result.removed += 1
    } else {
      const body = await response.text()
      result.failed.push({ sku: offerId, error: body.slice(0, 500) })
    }
  }

  return result
}

export { MERCHANT_ACCOUNT_ID }
