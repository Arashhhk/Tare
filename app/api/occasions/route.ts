import { connectDB } from "@/lib/mongodb"
import Occasion from "@/models/Occasion"
import { ok, serverError } from "@/lib/api-response"

export async function GET() {
  try {
    await connectDB()
    const occasions = await Occasion.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
    return ok(occasions)
  } catch (err) {
    return serverError(err)
  }
}
