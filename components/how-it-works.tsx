"use client"

import { useRef, useEffect } from "react"
import { Search, Gift, Truck } from "lucide-react"

const STEPS = [
  {
    icon: Search,
    title: "محصول یا مناسبتت رو انتخاب کن",
    description: "از بین صدها محصول تازه بگرد، یا مستقیم بر اساس مناسبت (تولد، عروسی، ختم و...) سبد آماده انتخاب کن.",
  },
  {
    icon: Gift,
    title: "سبدت رو نهایی کن",
    description: "محصولات رو به سبد خرید اضافه کن، آدرس و شماره تماست رو وارد کن — بدون نیاز به ثبت‌نام.",
  },
  {
    icon: Truck,
    title: "تحویل بگیر و پرداخت کن",
    description: "سفارش تازه و دست‌چین‌شده درِ خونه‌ت می‌رسه و هزینه رو همون‌جا پرداخت می‌کنی.",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".step-item", { y: 24, duration: 0.5, stagger: 0.15, ease: "power2.out" })
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">خرید از تره‌بار، سه قدم ساده</h2>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">بدون پیچیدگی، بدون نیاز به ثبت‌نام</p>
      </div>

      <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        <div className="absolute top-9 right-[16.5%] left-[16.5%] hidden h-0.5 bg-gradient-to-l from-emerald-200 via-amber-200 to-emerald-200 sm:block" />
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="step-item relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-neutral-100">
                <Icon className="h-8 w-8 text-emerald-600" />
                <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {idx + 1}
                </span>
              </div>
              <h3 className="mb-1.5 text-base font-bold text-neutral-800 sm:text-lg">{step.title}</h3>
              <p className="max-w-xs text-sm text-neutral-500">{step.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
