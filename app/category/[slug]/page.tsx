import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { ProductGrid } from "@/components/product-grid"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryFilters } from "@/components/category-filters"
import { connectDB } from "@/lib/mongodb"
import Category from "@/models/Category"
import Product from "@/models/Product"

// همیشه داینامیک: مستقیم از دیتابیس می‌خواند تا تغییرات پنل ادمین بلافاصله دیده شود
export const dynamic = "force-dynamic"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sub?: string; tags?: string; minPrice?: string; maxPrice?: string }>
}

async function getCategory(slug: string) {
  await connectDB()
  const category = await Category.findOne({ slug, isActive: true }).lean()
  return category ? JSON.parse(JSON.stringify(category)) : null
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: "دسته‌بندی یافت نشد | تره‌بار" }
  return {
    title: `${category.name} | تره‌بار`,
    description: category.description || `خرید ${category.name} تازه با بهترین قیمت`,
  }
}

const TAG_FIELD_MAP: Record<string, string> = {
  special: "isSpecialOffer",
  bestseller: "isBestSeller",
  daily: "isDailyDeal",
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const sp = await searchParams
  const category = await getCategory(slug)
  if (!category) notFound()

  await connectDB()

  const query: Record<string, unknown> = { category: category._id, isActive: true }

  const subs = sp.sub?.split(",").filter(Boolean) ?? []
  if (subs.length > 0) {
    query.lowCategories = { $in: subs }
  }

  const tags = sp.tags?.split(",").filter(Boolean) ?? []
  const validTags = tags.filter((t) => TAG_FIELD_MAP[t])
  if (validTags.length > 0) {
    query.$or = validTags.map((t) => ({ [TAG_FIELD_MAP[t]]: true }))
  }

  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {
      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
    }
  }

  const products = await Product.find(query)
    .populate("occasions", "name slug")
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="w-full overflow-x-hidden">
      <SiteHeader />
      <div className="container mx-auto min-w-0 px-4 py-6 sm:py-8">
        <Breadcrumbs items={[{ label: category.name }]} />
        <h1 className="mb-2 break-words text-2xl font-bold text-neutral-800 sm:text-3xl md:text-4xl">
          کالاهای دسته‌بندی <span className="text-orange-600">{category.name}</span>
        </h1>
        {category.description && <p className="mb-6 text-neutral-500">{category.description}</p>}

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <CategoryFilters subCategories={category.subCategories ?? []} />
          </div>
          <div className="lg:col-span-3">
            <p className="mb-4 text-sm text-neutral-500">{products.length} محصول یافت شد</p>
            <ProductGrid products={JSON.parse(JSON.stringify(products))} />
          </div>
        </div>
      </div>
    </div>
  )
}
