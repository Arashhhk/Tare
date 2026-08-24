import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import "@/models/Category"
import "@/models/Occasion"
import { ok, serverError } from "@/lib/api-response"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const pageSize = Math.min(60, Math.max(1, Number(searchParams.get("pageSize") ?? 24)))
    const category = searchParams.get("category") // slug یا id
    const occasion = searchParams.get("occasion") // slug یا id
    const search = searchParams.get("search")?.trim()
    const special = searchParams.get("special") // "true"
    const bestSeller = searchParams.get("bestSeller") // "true"
    const sort = searchParams.get("sort") ?? "newest" // newest | price-asc | price-desc | popular

    const query: Record<string, unknown> = { isActive: true }

    if (category) {
      query.category = /^[0-9a-fA-F]{24}$/.test(category) ? category : undefined
      if (!query.category) {
        // اگر id نبود، از طریق slug دسته پیدا می‌کنیم
        const Category = (await import("@/models/Category")).default
        const cat = await Category.findOne({ slug: category }).select("_id")
        query.category = cat?._id ?? "___no_match___"
      }
    }

    if (occasion) {
      let occasionId = occasion
      if (!/^[0-9a-fA-F]{24}$/.test(occasion)) {
        const Occasion = (await import("@/models/Occasion")).default
        const occ = await Occasion.findOne({ slug: occasion }).select("_id")
        occasionId = occ?._id?.toString() ?? "___no_match___"
      }
      query.occasions = occasionId
    }

    if (search) {
      query.$text = { $search: search }
    }
    if (special === "true") query.isSpecialOffer = true
    if (bestSeller === "true") query.isBestSeller = true

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      popular: { purchaseCount: -1 },
    }

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug color")
        .populate("occasions", "name slug icon color")
        .sort(sortMap[sort] ?? sortMap.newest)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(query),
    ])

    return ok(items, {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (err) {
    return serverError(err)
  }
}
