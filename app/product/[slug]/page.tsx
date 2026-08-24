import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Star } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import AddToCartButton from "@/components/add-to-cart-button"
import { SafeImage } from "@/components/safe-image"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import "@/models/Category"
import "@/models/Occasion"

// همیشه داینامیک: مستقیم از دیتابیس می‌خواند تا تغییرات پنل ادمین بلافاصله دیده شود
export const dynamic = "force-dynamic"


interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  await connectDB()
  const product = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .populate("occasions", "name slug color")
    .lean()
  return product ? JSON.parse(JSON.stringify(product)) : null
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "محصول یافت نشد | تره‌بار" }
  return {
    title: `${product.name} | تره‌بار`,
    description: product.description || `خرید ${product.name} با بهترین قیمت و کیفیت`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.images?.[0] ? [product.images[0]] : undefined,
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.ratingCount || 1,
          },
        }
      : {}),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            ...(product.category ? [{ label: product.category.name, href: `/category/${product.category.slug}` }] : []),
            { label: product.name },
          ]}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <SafeImage
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
              fallbackClassName="h-full min-h-[320px] w-full"
            />
          </div>

          <div>
            {product.category && (
              <p className="mb-1 text-sm text-emerald-700">{product.category.name}</p>
            )}
            <h1 className="mb-3 text-2xl font-bold text-neutral-800 sm:text-3xl">{product.name}</h1>

            {product.occasions?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {product.occasions.map((o: any) => (
                  <span key={o._id} className={`rounded-full bg-gradient-to-l px-3 py-1 text-xs font-medium text-white ${o.color}`}>
                    مناسب برای {o.name}
                  </span>
                ))}
              </div>
            )}

            {product.rating > 0 && (
              <div className="mb-4 flex items-center gap-1 text-sm text-neutral-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} ({product.ratingCount} نظر) · {product.purchaseCount} فروش
              </div>
            )}

            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900">{product.price.toLocaleString("fa-IR")}</span>
              <span className="text-sm text-neutral-500">تومان / {product.unit}</span>
              {discount > 0 && (
                <>
                  <span className="text-base text-neutral-400 line-through">{product.originalPrice.toLocaleString("fa-IR")}</span>
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">{discount}٪ تخفیف</span>
                </>
              )}
            </div>

            {product.description && <p className="mb-6 leading-relaxed text-neutral-600">{product.description}</p>}

            <div className="max-w-xs">
              <AddToCartButton
                productId={product._id}
                name={product.name}
                price={product.price}
                image={product.images?.[0] || "/placeholder.svg"}
                unit={product.unit}
                minOrderQty={product.minOrderQty}
                stepQty={product.stepQty}
                inStock={product.inStock}
              />
            </div>
            <p className="mt-3 text-xs text-neutral-400">
              حداقل سفارش: {product.minOrderQty} {product.unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
