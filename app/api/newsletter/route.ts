import { NextRequest } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import Newsletter from "@/models/Newsletter"
import { ok, fail, serverError } from "@/lib/api-response"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().trim().toLowerCase().email("ایمیل معتبر نیست"),
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const { allowed } = rateLimit(`newsletter:${ip}`, 5, 60_000)
    if (!allowed) {
      return fail("تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.", 429, "RATE_LIMITED")
    }

    const body = await req.json().catch(() => null)
    const parsed = schema.safeParse(body)
    if (!parsed.success) return fail("ایمیل معتبر نیست.", 400, "VALIDATION_ERROR")

    await connectDB()
    const existing = await Newsletter.findOne({ email: parsed.data.email })
    if (existing) {
      return ok({ alreadySubscribed: true })
    }

    await Newsletter.create({ email: parsed.data.email })
    return ok({ alreadySubscribed: false }, undefined, 201)
  } catch (err) {
    return serverError(err)
  }
}
