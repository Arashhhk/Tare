import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Occasion from "@/models/Occasion"
import Product from "@/models/Product"
import GiftBasket from "@/models/GiftBasket"
import { occasionUpdateSchema } from "@/lib/validation"
import { ok, fail, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = occasionUpdateSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات مناسبت نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const { id } = await params

    if (parsed.data.slug) {
      const exists = await Occasion.findOne({ slug: parsed.data.slug, _id: { $ne: id } })
      if (exists) return fail("مناسبتی با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")
    }

    const occasion = await Occasion.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
    if (!occasion) return notFound("مناسبت یافت نشد.")
    return ok(occasion)
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

    const [productsUsing, basketsUsing] = await Promise.all([
      Product.countDocuments({ occasions: id }),
      GiftBasket.countDocuments({ occasion: id }),
    ])
    if (productsUsing > 0 || basketsUsing > 0) {
      return fail(
        `این مناسبت به ${productsUsing} محصول و ${basketsUsing} سبد متصل است. ابتدا آن‌ها را ویرایش کنید.`,
        409,
        "OCCASION_IN_USE"
      )
    }

    const occasion = await Occasion.findByIdAndDelete(id)
    if (!occasion) return notFound("مناسبت یافت نشد.")
    return ok({ deleted: true })
  } catch (err) {
    return serverError(err)
  }
}
