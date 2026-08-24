import type { MetadataRoute } from "next"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"
import Occasion from "@/models/Occasion"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tarebar.ir"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB()

  const [products, categories, occasions] = await Promise.all([
    Product.find({ isActive: true }).select("slug updatedAt").lean(),
    Category.find({ isActive: true }).select("slug updatedAt").lean(),
    Occasion.find({ isActive: true }).select("slug updatedAt").lean(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/occasions`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/special-offers`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: any) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  const occasionRoutes: MetadataRoute.Sitemap = occasions.map((o: any) => ({
    url: `${SITE_URL}/occasions/${o.slug}`,
    lastModified: o.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...occasionRoutes,
  ]
}