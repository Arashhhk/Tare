import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Occasion from "@/models/Occasion"
import { occasionSchema } from "@/lib/validation"
import { ok, fail, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const occasions = await Occasion.find().sort({ sortOrder: 1, name: 1 })
    return ok(occasions)
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = occasionSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات مناسبت نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const exists = await Occasion.findOne({ slug: parsed.data.slug })
    if (exists) return fail("مناسبتی با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")

    const occasion = await Occasion.create(parsed.data)
    return ok(occasion, undefined, 201)
  } catch (err) {
    return serverError(err)
  }
}
