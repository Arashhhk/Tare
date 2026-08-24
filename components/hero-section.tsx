"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Truck, Award } from "lucide-react"
import { SafeImage } from "@/components/safe-image"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
        tl.from(".hero-title", { y: 24, duration: 0.7 })
          .from(".hero-subtitle", { y: 16, duration: 0.6 }, "-=0.4")
          .from(".hero-cta", { y: 16, scale: 0.96, duration: 0.5 }, "-=0.3")
          .from(".hero-badge", { y: 12, stagger: 0.1, duration: 0.4 }, "-=0.2")
          .from(".hero-image", { scale: 0.94, duration: 0.8, ease: "power2.out" }, "-=0.6")
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-r from-neutral-900 via-[#2E7D32] to-neutral-900 text-white w-full rounded-3xl overflow-hidden">
      <div className="absolute inset-0 industrial-pattern opacity-10"></div>

      <div className="relative w-full z-10 px-4 py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-4 2xl:py-5">
        <div className="top w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-20">
          <div className="flex flex-col items-start justify-center lg:items-center gap-4 sm:gap-6 md:gap-8 w-full h-full">
            <div className="titele flex flex-col items-center lg:items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 w-full">
              <div className="w-full flex flex-col items-center lg:items-center">
                <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px]">
                  <h1 className="hero-title text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-snug sm:leading-normal md:leading-[1.5] lg:leading-[1.75] xl:leading-[2] text-center lg:text-right">
                    تره بار
                    <div className="block text-orange-400">ارزانی همراه با تازگی و طراوت</div>
                  </h1>
                  <p className="hero-subtitle text-sm sm:text-base md:text-lg lg:text-xl text-neutral-300 leading-relaxed text-center lg:text-right mt-3 sm:mt-4 md:mt-5">
                    ارائه‌دهنده انواع میوه، صیفی‌جات و سبزی، همراه با سبدهای مناسبتی آماده برای تولد، عروسی و هر رویداد خاص
                  </p>
                </div>
              </div>
            </div>

            <div className="bt flex flex-col items-center lg:items-center gap-3 sm:gap-4 w-full">
              <Link href="/products" className="hero-cta w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px]">
                <Button size="lg" className="bg-orange-600 hover:bg-white hover:text-neutral-900 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 w-full transition-colors">
                  مشاهده محصولات
                  <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>

            <div className="log grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px] mx-auto lg:mx-0">
              <div className="hero-badge flex flex-col items-center justify-center">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 sm:mb-2 text-orange-400" />
                <p className="text-xs sm:text-sm md:text-base">ضمانت کیفیت</p>
              </div>
              <div className="hero-badge flex flex-col items-center justify-center">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 sm:mb-2 text-orange-400" />
                <p className="text-xs sm:text-sm md:text-base">ارسال سریع</p>
              </div>
              <div className="hero-badge flex flex-col items-center justify-center">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 sm:mb-2 text-orange-400" />
                <p className="text-xs sm:text-sm md:text-base">برند معتبر</p>
              </div>
            </div>
          </div>

          <div className="hero-image relative order-first lg:order-last h-full">
            <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20">
              <SafeImage
                src="/3.jpg"
                alt="میوه و سبزی"
                className="w-full h-auto rounded-lg"
                fallbackClassName="w-full aspect-[4/3] rounded-lg"
              />
            </div>
            <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 -right-2 sm:-right-3 md:-right-4 bg-orange-600 text-white p-2 sm:p-3 rounded-lg shadow-lg">
              <p className="text-xs font-medium">بیش از</p>
              <p className="text-lg sm:text-xl font-bold">100+</p>
              <p className="text-xs">محصول متنوع</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
