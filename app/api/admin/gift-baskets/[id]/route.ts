import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GiftBasket from "@/models/GiftBasket"
import { giftBasketUpdateSchema } from "@/lib/validation"
import { ok, fail, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = giftBasketUpdateSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات سبد مناسبتی نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const { id } = await params

    if (parsed.data.slug) {
      const exists = await GiftBasket.findOne({ slug: parsed.data.slug, _id: { $ne: id } })
      if (exists) return fail("سبدی با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")
    }

    const basket = await GiftBasket.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true })
    if (!basket) return notFound("سبد مناسبتی یافت نشد.")
    return ok(basket)
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
    const basket = await GiftBasket.findByIdAndDelete(id)
    if (!basket) return notFound("سبد مناسبتی یافت نشد.")
    return ok({ deleted: true })
  } catch (err) {
    return serverError(err)
  }
}
