import { connectDB } from "@/lib/mongodb"
import Category from "@/models/Category"
import { ok, serverError } from "@/lib/api-response"

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
    return ok(categories)
  } catch (err) {
    return serverError(err)
  }
}
