"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { SafeImage } from "@/components/safe-image"
import type { ICategory } from "@/types"

export function CategoryGrid({ categories }: { categories: ICategory[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".category-card", {
          y: 24,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
        })
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [categories])

  if (categories.length === 0) return null

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
            دسته‌بندی محصولات
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            انتخاب از بین دسته‌بندی‌های متنوع میوه و سبزیجات تازه
          </p>
        </div>
      </div>

      <Carousel
        opts={{ align: "start", loop: categories.length > 1, direction: "rtl", dragFree: false }}
        className="w-full"
      >
        <CarouselContent className="-mr-3 sm:-mr-4 ml-0">
          {categories.map((category) => (
            <CarouselItem
              key={category._id}
              className="category-card pr-3 sm:pr-4 pl-0 basis-1/2 sm:basis-[55%] md:basis-[42%] lg:basis-[30%]"
            >
              <Link href={`/category/${category.slug}`} className="group flex flex-col items-center gap-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <SafeImage
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
                <span className="rounded-full bg-neutral-50 px-4 py-1.5 text-sm font-bold text-neutral-700 ring-1 ring-neutral-100 transition-colors duration-300 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:ring-emerald-100">
                  {category.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
