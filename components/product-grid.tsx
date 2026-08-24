"use client"

import { useRef, useEffect } from "react"
import { PackageSearch } from "lucide-react"
import { ProductCard, type ProductCardData } from "@/components/product-card"

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".grid-product-card", { y: 16, duration: 0.4, stagger: 0.04, ease: "power2.out" })
      }, gridRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [products])

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
        <PackageSearch className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
        <p className="text-neutral-500">محصولی با این مشخصات یافت نشد.</p>
      </div>
    )
  }

  return (
    <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <div key={p._id} className="grid-product-card">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  )
}
