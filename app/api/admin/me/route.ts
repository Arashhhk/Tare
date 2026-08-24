import { requireAdmin } from "@/lib/require-admin"
import { ok, fail } from "@/lib/api-response"

export async function GET() {
  const result = await requireAdmin()
  if (!result.ok) {
    return fail(result.message, result.status, "UNAUTHORIZED")
  }
  return ok({ admin: result.admin })
}
