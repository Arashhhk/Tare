import type { Metadata } from "next"
import { ProductGrid } from "@/components/product-grid"
import { SiteHeader } from "@/components/site-header"
import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"

// همیشه داینامیک: مستقیم از دیتابیس می‌خواند تا تغییرات پنل ادمین بلافاصله دیده شود
export const dynamic = "force-dynamic"


export const metadata: Metadata = {
  title: "فروش ویژه | تره‌بار",
  description: "پیشنهادهای شگفت‌انگیز و تخفیف‌دار میوه و صیفی‌جات تازه",
}

export default async function SpecialOffersPage() {
  await connectDB()
  const products = await Product.find({ isActive: true, isSpecialOffer: true }).sort({ createdAt: -1 }).lean()

  return (
    <div>
      <SiteHeader />
      <div className="container">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-neutral-800 sm:text-4xl">فروش ویژه</h1>
            <p className="text-lg text-neutral-600">بهترین تخفیف‌های این هفته را از دست ندهید</p>
          </div>
          <ProductGrid products={JSON.parse(JSON.stringify(products))} />
        </div>
      </div>
    </div>
  )
}
