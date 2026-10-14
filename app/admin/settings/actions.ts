"use server"

import { revalidatePath } from "next/cache"
import { getAdminSession } from "@/lib/admin-auth"
import { repairDatabase } from "@/lib/admin-health"

export interface RepairState {
  ok: boolean
  message: string
}

export async function repairDatabaseAction(_prev: RepairState): Promise<RepairState> {
  if (!(await getAdminSession())) return { ok: false, message: "Session expired. Please log in again." }
  try {
    await repairDatabase()
  } catch (error) {
    return { ok: false, message: `Repair failed: ${error instanceof Error ? error.message : String(error)}` }
  }
  revalidatePath("/admin/settings")
  revalidatePath("/admin/dashboard")
  return { ok: true, message: "Done — missing tables and columns were added." }
}
