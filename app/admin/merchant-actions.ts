"use server"

import { revalidatePath } from "next/cache"
import { getAdminSession } from "@/lib/admin-auth"
import { getBrandProductBySlug, getBrandProductUrl, isValidBrand } from "@/lib/brand-catalog"
import { AVAILABILITY_OPTIONS, deleteOverride, upsertOverride, type Availability } from "@/lib/merchant"

export interface MerchantActionState {
  ok: boolean
  message: string
}

const text = (v: FormDataEntryValue | null, max: number) => {
  const s = String(v ?? "").trim().slice(0, max)
  return s === "" ? null : s
}

async function resolveTarget(formData: FormData) {
  if (!(await getAdminSession())) return { ok: false as const, error: "Session expired. Please log in again." }
  const brand = String(formData.get("brand") ?? "")
  const slug = String(formData.get("slug") ?? "")
  if (!isValidBrand(brand)) return { ok: false as const, error: "Unknown brand." }
  const product = getBrandProductBySlug(brand, slug)
  if (!product) return { ok: false as const, error: "Product not found." }
  return { ok: true as const, brand, slug, url: getBrandProductUrl(brand, product) }
}

function revalidate(url: string) {
  revalidatePath(url)
  revalidatePath("/admin/merchant")
}

export async function saveProductOverride(
  _prev: MerchantActionState,
  formData: FormData,
): Promise<MerchantActionState> {
  const target = await resolveTarget(formData)
  if (!target.ok) return { ok: false, message: target.error }

  const rawPrice = String(formData.get("price") ?? "").trim()
  const price = rawPrice === "" ? null : Number(rawPrice)
  if (price !== null && (!Number.isFinite(price) || price <= 0 || price > 100_000)) {
    return { ok: false, message: "Price must be between $1 and $100,000." }
  }

  const imageUrl = text(formData.get("imageUrl"), 1000)
  if (imageUrl && !/^https:\/\/\S+$/i.test(imageUrl)) {
    return { ok: false, message: "Image URL must start with https://" }
  }

  const rawAvailability = String(formData.get("availability") ?? "")
  const availability = AVAILABILITY_OPTIONS.find((a) => a === rawAvailability) ?? null

  await upsertOverride(target.brand, target.slug, {
    title: text(formData.get("title"), 150),
    description: text(formData.get("description"), 5000),
    price,
    imageUrl,
    availability: availability as Availability | null,
    hidden: formData.get("hidden") === "on",
    excludeFromFeed: formData.get("excludeFromFeed") === "on",
    notes: text(formData.get("notes"), 2000),
  })
  revalidate(target.url)
  return { ok: true, message: "Saved — live on the page and in the next Google fetch." }
}

export async function updateProductFix(prev: MerchantActionState, formData: FormData): Promise<MerchantActionState> {
  return formData.get("intent") === "reset" ? resetProductOverride(prev, formData) : saveProductOverride(prev, formData)
}

export async function resetProductOverride(
  _prev: MerchantActionState,
  formData: FormData,
): Promise<MerchantActionState> {
  const target = await resolveTarget(formData)
  if (!target.ok) return { ok: false, message: target.error }
  await deleteOverride(target.brand, target.slug)
  revalidate(target.url)
  return { ok: true, message: "Reset to the original sheet data." }
}
