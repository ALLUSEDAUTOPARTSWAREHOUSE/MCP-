"use server"

import { revalidatePath } from "next/cache"
import { getAdminSession } from "@/lib/admin-auth"
import { BRAND_DIRECTORY, getBrandProductUrl, isValidBrand } from "@/lib/brand-catalog"
import {
  createManualProduct,
  deleteManualProduct,
  importProductSheet,
  toBrandProduct,
} from "@/lib/manual-products"

export interface CatalogActionState {
  ok: boolean
  message: string
}

function revalidateCatalog(brand?: string) {
  revalidatePath("/admin/merchant")
  revalidatePath("/feeds/google-shopping.xml")
  if (brand) {
    revalidatePath(`/brands/${brand}`)
    revalidatePath(`/brands/${brand}`, "layout")
  } else {
    for (const b of BRAND_DIRECTORY) revalidatePath(`/brands/${b.slug}`, "layout")
  }
}

/** "Sync Products" — republishes the live catalog so every page reflects the latest sheet, override and manual-product data. */
export async function syncProducts(_prev: CatalogActionState): Promise<CatalogActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }
  revalidateCatalog()
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  return { ok: true, message: `Synced — the website is up to date as of ${time}. Google picks it up on its next feed fetch.` }
}

export async function addManualProduct(_prev: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }

  const brand = String(formData.get("brand") ?? "")
  if (!isValidBrand(brand)) return { ok: false, message: "Choose a brand." }

  const name = String(formData.get("name") ?? "").trim().slice(0, 150)
  if (!name) return { ok: false, message: "Product name is required." }

  const rawPrice = String(formData.get("price") ?? "").trim()
  const price = rawPrice === "" ? null : Number(rawPrice)
  if (price !== null && (!Number.isFinite(price) || price <= 0 || price > 100_000)) {
    return { ok: false, message: "Price must be between $1 and $100,000, or left blank for quote-only." }
  }

  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null
  if (imageUrl && !/^https:\/\/\S+$/i.test(imageUrl)) {
    return { ok: false, message: "Image URL must start with https://" }
  }

  const product = await createManualProduct(brand, {
    name,
    description: String(formData.get("description") ?? "").trim().slice(0, 5000) || null,
    price,
    imageUrl,
    category: String(formData.get("category") ?? "engine"),
    model: String(formData.get("model") ?? "").trim().slice(0, 100) || null,
    year: String(formData.get("year") ?? "").trim().slice(0, 20) || null,
  })

  revalidateCatalog(brand)
  return {
    ok: true,
    message: `Added — live at ${getBrandProductUrl(brand, toBrandProduct(product))}`,
  }
}

export async function removeManualProduct(_prev: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }
  const brand = String(formData.get("brand") ?? "")
  const slug = String(formData.get("slug") ?? "")
  if (!isValidBrand(brand) || !slug) return { ok: false, message: "Product not found." }
  await deleteManualProduct(brand, slug)
  revalidateCatalog(brand)
  return { ok: true, message: "Removed." }
}

export async function uploadProductSheet(_prev: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }

  const brand = String(formData.get("brand") ?? "")
  if (!isValidBrand(brand)) return { ok: false, message: "Choose a brand." }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a spreadsheet file (.xlsx)." }
  if (!/\.xlsx?$/i.test(file.name)) return { ok: false, message: "Only .xlsx or .xls files are supported." }
  if (file.size > 20 * 1024 * 1024) return { ok: false, message: "File is too large (max 20MB)." }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const { inserted, skipped } = await importProductSheet(brand, buffer)
    if (inserted === 0) {
      return { ok: false, message: "No usable rows found — the sheet needs a 'Product Name' and 'Price' column." }
    }
    revalidateCatalog(brand)
    return {
      ok: true,
      message: `Imported ${inserted.toLocaleString()} product${inserted === 1 ? "" : "s"}${skipped ? ` (skipped ${skipped} row${skipped === 1 ? "" : "s"} with no name)` : ""} — live now.`,
    }
  } catch (error) {
    console.error("[admin] sheet upload failed:", (error as Error).message)
    return { ok: false, message: "Could not read that file. Make sure it's a valid Excel spreadsheet." }
  }
}
