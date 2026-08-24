"use client"

import { useRef, useEffect } from "react"
import { CalendarClock } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ProductCard, type ProductCardData } from "@/components/product-card"
import { ProductSectionHeader } from "@/components/product-section-header"

export function DailyDeals({ products }: { products: ProductCardData[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".daily-card", { y: 20, duration: 0.5, stagger: 0.06, ease: "power2.out" })
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [products])

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16">
      <ProductSectionHeader
        icon={CalendarClock}
        badgeLabel="پیشنهاد روزانه"
        title="محصولات امروز"
        viewAllHref="/products"
        badgeClassName="bg-sky-100 text-sky-700"
        bgClassName="bg-gradient-to-l from-sky-50 to-emerald-50"
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-14 text-center">
          <CalendarClock className="mb-3 h-8 w-8 text-neutral-300" />
          <p className="mb-1 text-sm font-medium text-neutral-500">هنوز محصولی برای امروز انتخاب نشده</p>
          <p className="text-xs text-neutral-400">
            از پنل ادمین → محصولات، روی یک محصول «پیشنهاد روزانه» را فعال کنید تا اینجا نمایش داده شود.
          </p>
        </div>
      ) : (
        <Carousel opts={{ align: "start", loop: false, direction: "rtl" }} className="w-full">
          <CarouselContent className="-mr-3 ml-0 sm:-mr-4">
            {products.map((p) => (
              <CarouselItem key={p._id} className="daily-card basis-[46%] pl-0 pr-3 sm:basis-[32%] sm:pr-4 md:basis-[24%] lg:basis-[19%]">
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </section>
  )
}
