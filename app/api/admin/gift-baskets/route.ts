import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GiftBasket from "@/models/GiftBasket"
import "@/models/Occasion"
import "@/models/Product"
import { giftBasketSchema } from "@/lib/validation"
import { ok, fail, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const baskets = await GiftBasket.find()
      .populate("occasion", "name slug")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })
    return ok(baskets)
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = giftBasketSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات سبد مناسبتی نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const exists = await GiftBasket.findOne({ slug: parsed.data.slug })
    if (exists) return fail("سبدی با این اسلاگ قبلاً ثبت شده است.", 409, "DUPLICATE_SLUG")

    const basket = await GiftBasket.create(parsed.data)
    return ok(basket, undefined, 201)
  } catch (err) {
    return serverError(err)
  }
}
