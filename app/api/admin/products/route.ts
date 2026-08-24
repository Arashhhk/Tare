import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import "@/models/Category"
import "@/models/Occasion"
import { productSchema } from "@/lib/validation"
import { normalizeImagePath } from "@/lib/image-path"
import { ok, fail, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 30)))
    const search = searchParams.get("search")?.trim()

    const query: Record<string, unknown> = {}
    if (search) query.name = { $regex: search, $options: "i" }

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate("occasions", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(query),
    ])

    return ok(items, { total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات محصول نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()

    const exists = await Product.findOne({ slug: parsed.data.slug })
    if (exists) return fail("محصولی با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")

    // امنیت/یکپارچگی: مسیر تصاویر همیشه سمت سرور هم نرمال‌سازی می‌شود، مستقل از این‌که
    // کلاینت (فرانت پنل ادمین) چه چیزی فرستاده — هرگز فقط به اعتبارسنجی سمت کلاینت اعتماد نمی‌کنیم.
    const normalizedData = {
      ...parsed.data,
      images: (parsed.data.images ?? [])
        .map((img) => normalizeImagePath(img))
        .filter((img): img is string => Boolean(img)),
    }

    const product = await Product.create(normalizedData)
    return ok(product, undefined, 201)
  } catch (err) {
    return serverError(err)
  }
}
