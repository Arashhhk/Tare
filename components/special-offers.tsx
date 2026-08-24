"use client"

import { useRef, useEffect } from "react"
import { Percent } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ProductCard, type ProductCardData } from "@/components/product-card"
import { ProductSectionHeader } from "@/components/product-section-header"

export function SpecialOffers({ products }: { products: ProductCardData[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".offer-card", { x: 20, duration: 0.5, stagger: 0.06, ease: "power2.out" })
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
        icon={Percent}
        badgeLabel="فروش ویژه"
        title="پیشنهادهای شگفت‌انگیز"
        viewAllHref="/special-offers"
        badgeClassName="bg-red-600 text-white"
        bgClassName="bg-gradient-to-l from-red-50 to-orange-50"
      />

      <Carousel opts={{ align: "start", loop: false, direction: "rtl" }} className="w-full">
        <CarouselContent className="-mr-3 ml-0 sm:-mr-4">
          {products.map((p) => (
            <CarouselItem key={p._id} className="offer-card basis-[46%] pl-0 pr-3 sm:basis-[32%] sm:pr-4 md:basis-[24%] lg:basis-[19%]">
              <ProductCard product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
