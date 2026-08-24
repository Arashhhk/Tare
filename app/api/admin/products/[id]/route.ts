import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import { productUpdateSchema } from "@/lib/validation"
import { normalizeImagePath } from "@/lib/image-path"
import { ok, fail, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const { id } = await params
    const product = await Product.findById(id).populate("category", "name slug").populate("occasions", "name slug")
    if (!product) return notFound("محصول یافت نشد.")
    return ok(product)
  } catch (err) {
    return serverError(err)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = productUpdateSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات محصول نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const { id } = await params

    if (parsed.data.slug) {
      const exists = await Product.findOne({ slug: parsed.data.slug, _id: { $ne: id } })
      if (exists) return fail("محصولی با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")
    }

    // امنیت/یکپارچگی: مسیر تصاویر همیشه سمت سرور هم نرمال‌سازی می‌شود (نگاه کن به POST /api/admin/products)
    const normalizedData = {
      ...parsed.data,
      ...(parsed.data.images
        ? {
            images: parsed.data.images
              .map((img) => normalizeImagePath(img))
              .filter((img): img is string => Boolean(img)),
          }
        : {}),
    }

    const product = await Product.findByIdAndUpdate(id, normalizedData, { new: true, runValidators: true })
    if (!product) return notFound("محصول یافت نشد.")
    return ok(product)
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
    const product = await Product.findByIdAndDelete(id)
    if (!product) return notFound("محصول یافت نشد.")
    return ok({ deleted: true })
  } catch (err) {
    return serverError(err)
  }
}
