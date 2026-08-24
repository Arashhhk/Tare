import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
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
    const status = searchParams.get("status")
    const search = searchParams.get("search")?.trim() // شماره سفارش یا شماره تماس

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
      ]
    }

    const [items, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Order.countDocuments(query),
    ])

    return ok(items, { total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  } catch (err) {
    return serverError(err)
  }
}
