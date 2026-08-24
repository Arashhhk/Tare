"use client"

import { useRef, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ProductCard, type ProductCardData } from "@/components/product-card"
import { ProductSectionHeader } from "@/components/product-section-header"

export function BestsellingProducts({ products }: { products: ProductCardData[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".bestseller-card", { y: 20, duration: 0.5, stagger: 0.06, ease: "power2.out" })
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [products])

  if (products.length === 0) return null

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16">
      <ProductSectionHeader
        icon={TrendingUp}
        badgeLabel="پرفروش‌ترین‌ها"
        title="محبوب‌ترین محصولات"
        viewAllHref="/products?sort=popular"
        badgeClassName="bg-amber-100 text-amber-700"
        bgClassName="bg-gradient-to-l from-amber-50 to-orange-50"
      />

      <Carousel opts={{ align: "start", loop: false, direction: "rtl" }} className="w-full">
        <CarouselContent className="-mr-3 ml-0 sm:-mr-4">
          {products.map((p) => (
            <CarouselItem key={p._id} className="bestseller-card basis-[46%] pl-0 pr-3 sm:basis-[32%] sm:pr-4 md:basis-[24%] lg:basis-[19%]">
              <ProductCard product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
