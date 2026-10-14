import { redirect } from "next/navigation"

/** Old Acura sample part IDs have no counterpart in the current sheet, so send shoppers to the Acura catalog. */
export default function AcuraPartDetailPage() {
  redirect("/brands/acura")
}
