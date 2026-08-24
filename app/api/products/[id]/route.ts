import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import "@/models/Category"
import "@/models/Occasion"
import { ok, notFound, serverError } from "@/lib/api-response"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)

    const product = await Product.findOne({
      ...(isObjectId ? { _id: id } : { slug: id }),
      isActive: true,
    })
      .populate("category", "name slug color")
      .populate("occasions", "name slug icon color")
      .lean()

    if (!product) return notFound("محصول یافت نشد.")
    return ok(product)
  } catch (err) {
    return serverError(err)
  }
}
