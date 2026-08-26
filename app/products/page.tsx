import type { Metadata } from "next"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { SiteHeader } from "@/components/site-header"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"
import Occasion from "@/models/Occasion"

export const metadata: Metadata = {
  title: "تمام محصولات | تره‌بار",
  description: "مشاهده و جستجوی تمام محصولات میوه و صیفی‌جات تازه فروشگاه تره‌بار",
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; occasion?: string; sub?: string; sort?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  await connectDB()

  const [categories, occasions] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    Occasion.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ])

  const query: Record<string, unknown> = { isActive: true }

  if (params.category) {
    const cat = categories.find((c: any) => c.slug === params.category)
    if (cat) query.category = (cat as any)._id
  }
  if (params.occasion) {
    const occ = occasions.find((o: any) => o.slug === params.occasion)
    if (occ) query.occasions = (occ as any)._id
  }
  const subs = params.sub?.split(",").filter(Boolean) ?? []
  if (subs.length > 0) {
    query.lowCategories = { $in: subs }
  }
  if (params.search) {
    query.$text = { $search: params.search }
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    popular: { purchaseCount: -1 },
  }

  const products = await Product.find(query)
    .sort(sortMap[params.sort ?? "newest"] ?? sortMap.newest)
    .lean()

  return (
    <div>
      <SiteHeader />
      <div className="container">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2 sm:text-4xl">
              {params.search ? `نتایج جستجو برای «${params.search}»` : "تمام محصولات"}
            </h1>
            <p className="text-lg text-neutral-600 sm:text-xl">{products.length} محصول یافت شد</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <ProductFilters categories={JSON.parse(JSON.stringify(categories))} occasions={JSON.parse(JSON.stringify(occasions))} />
            </div>
            <div className="lg:col-span-3">
              <ProductGrid products={JSON.parse(JSON.stringify(products))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
