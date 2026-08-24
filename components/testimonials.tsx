"use client"

import { useRef, useEffect } from "react"
import { Star, Quote } from "lucide-react"

// نظرات نمونه برای نمایش دموی پروژه — قبل از استفاده واقعی با نظرات واقعی مشتریان جایگزین شود
const TESTIMONIALS = [
  {
    name: "سارا محمدی",
    role: "مشتری همیشگی",
    text: "سبد میوه‌ای که برای تولد مامانم سفارش دادم واقعاً شیک و تازه بود. بسته‌بندی هم خیلی مرتب بود.",
    rating: 5,
  },
  {
    name: "امیر حسینی",
    role: "خرید هفتگی",
    text: "قیمت‌ها واقعاً به‌صرفه‌ست و کیفیت میوه‌ها هم عالیه. چند ماهه هر هفته از همینجا سفارش می‌دم.",
    rating: 5,
  },
  {
    name: "نگار کریمی",
    role: "سبد مناسبتی عروسی",
    text: "برای عروسی خواهرم یه سبد بزرگ سفارش دادم، هم زیبا بود هم به‌موقع رسید. پیشنهاد می‌کنم.",
    rating: 5,
  },
  {
    name: "رضا احمدی",
    role: "مشتری تازه",
    text: "اولین بارم بود که آنلاین میوه سفارش می‌دادم، تجربه‌ی خیلی خوبی بود و حتماً تکرار می‌کنم.",
    rating: 4,
  },
]

function initialsOf(name: string) {
  return name.split(" ")[0]?.[0] ?? "?"
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".testimonial-card", { y: 20, duration: 0.5, stagger: 0.08, ease: "power2.out" })
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16">
      <div className="mb-10 text-center sm:mb-12">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">مشتری‌ها چی می‌گن؟</h2>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">تجربه‌ی واقعی خریداران تره‌بار</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="testimonial-card flex flex-col rounded-2xl border border-neutral-200 bg-white p-5">
            <Quote className="mb-3 h-6 w-6 text-emerald-200" />
            <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600">{t.text}</p>
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`} />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {initialsOf(t.name)}
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800">{t.name}</p>
                <p className="text-xs text-neutral-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
