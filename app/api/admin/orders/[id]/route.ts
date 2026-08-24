import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import { updateOrderStatusSchema } from "@/lib/validation"
import { ok, fail, notFound, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()
    const { id } = await params
    const order = await Order.findById(id)
    if (!order) return notFound("سفارش یافت نشد.")

    // اولین باری که ادمین جزئیات سفارش را باز می‌کند، به‌عنوان «دیده‌شده» علامت می‌خورد
    // و از شمارش «سفارش‌های جدید» در سایدبار خارج می‌شود.
    if (!order.viewedAt) {
      order.viewedAt = new Date()
      await order.save()
    }

    return ok(order)
  } catch (err) {
    return serverError(err)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    const body = await req.json().catch(() => null)
    const parsed = updateOrderStatusSchema.safeParse(body)
    if (!parsed.success) return fail("مقادیر ارسالی نامعتبر است.", 400, "VALIDATION_ERROR")
    if (!parsed.data.status && !parsed.data.paymentStatus) {
      return fail("حداقل یکی از وضعیت سفارش یا وضعیت پرداخت باید ارسال شود.", 400, "VALIDATION_ERROR")
    }

    await connectDB()
    const { id } = await params
    const update: Record<string, string> = {}
    if (parsed.data.status) update.status = parsed.data.status
    if (parsed.data.paymentStatus) update.paymentStatus = parsed.data.paymentStatus

    const order = await Order.findByIdAndUpdate(id, update, { new: true })
    if (!order) return notFound("سفارش یافت نشد.")
    return ok(order)
  } catch (err) {
    return serverError(err)
  }
}
