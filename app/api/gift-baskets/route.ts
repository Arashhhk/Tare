import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GiftBasket from "@/models/GiftBasket"
import "@/models/Occasion"
import "@/models/Product"
import { ok, serverError } from "@/lib/api-response"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const occasion = searchParams.get("occasion")

    const query: Record<string, unknown> = { isActive: true }
    if (occasion) {
      let occasionId = occasion
      if (!/^[0-9a-fA-F]{24}$/.test(occasion)) {
        const Occasion = (await import("@/models/Occasion")).default
        const occ = await Occasion.findOne({ slug: occasion }).select("_id")
        occasionId = occ?._id?.toString() ?? "___no_match___"
      }
      query.occasion = occasionId
    }

    const baskets = await GiftBasket.find(query)
      .populate("occasion", "name slug icon color")
      .populate("items.product", "name slug price images unit")
      .sort({ createdAt: -1 })
      .lean()

    return ok(baskets)
  } catch (err) {
    return serverError(err)
  }
}
