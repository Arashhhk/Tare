import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import { ok, fail, serverError } from "@/lib/api-response"
import { requireAdmin } from "@/lib/require-admin"

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (!auth.ok) return fail(auth.message, auth.status)

    await connectDB()

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [newOrders, pendingOrders, unpaidOrders, todayOrders, todayRevenueAgg] = await Promise.all([
      Order.countDocuments({ viewedAt: { $exists: false } }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ paymentStatus: "unpaid", status: { $ne: "cancelled" } }),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ])

    return ok({
      newOrders,
      pendingOrders,
      unpaidOrders,
      todayOrders,
      todayRevenue: todayRevenueAgg[0]?.total ?? 0,
    })
  } catch (err) {
    return serverError(err)
  }
}
