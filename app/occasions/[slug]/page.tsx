import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PartyPopper } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ProductGrid } from "@/components/product-grid"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { getOccasionWithProducts } from "@/lib/server-data"
import { connectDB } from "@/lib/mongodb"
import GiftBasket from "@/models/GiftBasket"

// همیشه داینامیک: مستقیم از دیتابیس می‌خواند تا تغییرات پنل ادمین بلافاصله دیده شود
export const dynamic = "force-dynamic"


interface OccasionPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getOccasionWithProducts(slug)
  if (!result) return { title: "مناسبت یافت نشد | تره‌بار" }
  return {
    title: `سبد میوه ${result.occasion.name} | تره‌بار`,
    description: result.occasion.description || `بهترین محصولات مناسب برای ${result.occasion.name}`,
  }
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const { slug } = await params
  const result = await getOccasionWithProducts(slug)
  if (!result) notFound()
  const { occasion, products } = result

  await connectDB()
  const baskets = await GiftBasket.find({ occasion: occasion._id, isActive: true })
    .populate("items.product", "name")
    .lean()

  return (
    <div>
      <SiteHeader />
      <div className={`bg-gradient-to-br px-4 py-10 text-white sm:py-14 ${occasion.color}`}>
        <div className="container mx-auto text-center">
          <PartyPopper className="mx-auto mb-3 h-8 w-8" />
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">سبد میوه {occasion.name}</h1>
          {occasion.description && <p className="text-white/85">{occasion.description}</p>}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "مناسبت‌ها", href: "/occasions" }, { label: occasion.name }]} />
        {baskets.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-neutral-800">سبدهای آماده {occasion.name}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {baskets.map((b: any) => (
                <div key={b._id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <h3 className="mb-1 font-bold text-neutral-800">{b.name}</h3>
                  {b.description && <p className="mb-2 text-sm text-neutral-500 line-clamp-2">{b.description}</p>}
                  <p className="mb-1 text-xs text-neutral-400">
                    شامل: {b.items.map((it: any) => it.product?.name).filter(Boolean).join("، ")}
                  </p>
                  <p className="font-bold text-emerald-700">{b.price.toLocaleString("fa-IR")} تومان</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="mb-4 text-xl font-bold text-neutral-800">محصولات مناسب {occasion.name}</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
