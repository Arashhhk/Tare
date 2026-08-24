import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Category from "@/models/Category"
import Product from "@/models/Product"
import { categoryUpdateSchema } from "@/lib/validation"
import { normalizeImagePath } from "@/lib/image-path"
import { ok, fail, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = categoryUpdateSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات دسته‌بندی نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const { id } = await params

    if (parsed.data.slug) {
      const exists = await Category.findOne({ slug: parsed.data.slug, _id: { $ne: id } })
      if (exists) return fail("دسته‌ای با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")
    }

    const normalizedData = {
      ...parsed.data,
      ...(parsed.data.image ? { image: normalizeImagePath(parsed.data.image) ?? undefined } : {}),
    }

    const category = await Category.findByIdAndUpdate(id, normalizedData, { new: true, runValidators: true })
    if (!category) return notFound("دسته‌بندی یافت نشد.")
    return ok(category)
  } catch (err) {
    return serverError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const { id } = await params

    const inUse = await Product.countDocuments({ category: id })
    if (inUse > 0) {
      return fail(`این دسته‌بندی به ${inUse} محصول متصل است. ابتدا محصولات را جابه‌جا یا حذف کنید.`, 409, "CATEGORY_IN_USE")
    }

    const category = await Category.findByIdAndDelete(id)
    if (!category) return notFound("دسته‌بندی یافت نشد.")
    return ok({ deleted: true })
  } catch (err) {
    return serverError(err)
  }
}
