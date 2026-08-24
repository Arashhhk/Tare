import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Category from "@/models/Category"
import { categorySchema } from "@/lib/validation"
import { normalizeImagePath } from "@/lib/image-path"
import { ok, fail, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 })
    return ok(categories)
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات دسته‌بندی نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const exists = await Category.findOne({ slug: parsed.data.slug })
    if (exists) return fail("دسته‌ای با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")

    const normalizedData = {
      ...parsed.data,
      ...(parsed.data.image ? { image: normalizeImagePath(parsed.data.image) ?? undefined } : {}),
    }

    const category = await Category.create(normalizedData)
    return ok(category, undefined, 201)
  } catch (err) {
    return serverError(err)
  }
}
