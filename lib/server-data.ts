import { connectDB } from "@/lib/mongodb"
import Category from "@/models/Category"
import Occasion from "@/models/Occasion"
import Product from "@/models/Product"

/**
 * توابع کمکی سمت سرور برای Server Componentها.
 * به‌جای fetch کردن API خودمان (که به هاردکد کردن دامنه نیاز دارد)، مستقیم از DB می‌خوانیم؛
 * سریع‌تر است و در production/serverless هم بدون مشکل کار می‌کند.
 */

export async function getActiveCategories() {
  await connectDB()
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
  return JSON.parse(JSON.stringify(categories))
}

export async function getActiveOccasions() {
  await connectDB()
  const occasions = await Occasion.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
  return JSON.parse(JSON.stringify(occasions))
}

export async function getHomepageProducts() {
  await connectDB()
  const [bestSellers, specialOffers, dailyDeals] = await Promise.all([
    Product.find({ isActive: true, isBestSeller: true })
      .populate("category", "name slug")
      .populate("occasions", "name slug")
      .sort({ purchaseCount: -1 })
      .limit(12)
      .lean(),
    Product.find({ isActive: true, isSpecialOffer: true })
      .populate("category", "name slug")
      .populate("occasions", "name slug")
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
    Product.find({ isActive: true, isDailyDeal: true })
      .populate("category", "name slug")
      .populate("occasions", "name slug")
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
  ])
  return {
    bestSellers: JSON.parse(JSON.stringify(bestSellers)),
    specialOffers: JSON.parse(JSON.stringify(specialOffers)),
    dailyDeals: JSON.parse(JSON.stringify(dailyDeals)),
  }
}

export async function getCategoryWithProducts(slug: string) {
  await connectDB()
  const category = await Category.findOne({ slug, isActive: true }).lean()
  if (!category) return null
  const products = await Product.find({ category: (category as any)._id, isActive: true })
    .populate("occasions", "name slug")
    .sort({ createdAt: -1 })
    .lean()
  return {
    category: JSON.parse(JSON.stringify(category)),
    products: JSON.parse(JSON.stringify(products)),
  }
}

export async function getOccasionWithProducts(slug: string) {
  await connectDB()
  const occasion = await Occasion.findOne({ slug, isActive: true }).lean()
  if (!occasion) return null
  const products = await Product.find({ occasions: (occasion as any)._id, isActive: true })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean()
  return {
    occasion: JSON.parse(JSON.stringify(occasion)),
    products: JSON.parse(JSON.stringify(products)),
  }
}

export async function getAllProductsForListing() {
  await connectDB()
  const products = await Product.find({ isActive: true })
    .populate("category", "name slug")
    .populate("occasions", "name slug")
    .sort({ createdAt: -1 })
    .lean()
  return JSON.parse(JSON.stringify(products))
}
