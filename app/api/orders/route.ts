import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import Order from "@/models/Order"
import { createOrderSchema } from "@/lib/validation"
import { ok, fail, serverError } from "@/lib/api-response"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

function generateOrderNumber(): string {
  const now = new Date()
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `TR-${datePart}-${randomPart}`
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const { allowed } = rateLimit(`order:${ip}`, 8, 60_000) // حداکثر ۸ سفارش در دقیقه از هر IP
    if (!allowed) {
      return fail("تعداد درخواست‌های شما زیاد است. کمی صبر کنید و دوباره تلاش کنید.", 429, "RATE_LIMITED")
    }

    const body = await req.json().catch(() => null)
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات سفارش نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    await connectDB()
    const { customerName, customerPhone, customerAddress, items, notes } = parsed.data

    // هرگز به قیمت/موجودی ارسالی از کلاینت اعتماد نمی‌کنیم؛ همه چیز از دیتابیس خوانده می‌شود
    const productIds = items.map((i) => i.product)
    const products = await Product.find({ _id: { $in: productIds }, isActive: true })

    const orderItems = []
    let totalAmount = 0

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.product)
      if (!product) {
        return fail(`یکی از محصولات سبد خرید دیگر موجود نیست.`, 400, "PRODUCT_NOT_FOUND")
      }
      if (!product.inStock || product.stockQuantity < item.quantity) {
        return fail(`موجودی «${product.name}» کافی نیست.`, 409, "OUT_OF_STOCK")
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
      })
      totalAmount += product.price * item.quantity
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerName,
      customerPhone,
      customerAddress,
      items: orderItems,
      totalAmount,
      notes: notes || undefined,
      status: "pending",
    })

    // کاهش موجودی محصولات پس از ثبت موفق سفارش
    await Promise.all(
      orderItems.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } })
      )
    )

    return ok(
      {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
      undefined,
      201
    )
  } catch (err) {
    return serverError(err)
  }
}
