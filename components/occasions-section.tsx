"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { PartyPopper, ArrowLeft } from "lucide-react"
import type { IOccasion } from "@/types"

export function OccasionsSection({ occasions }: { occasions: IOccasion[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: any
    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(".occasion-card", {
          scale: 0.92,
          y: 20,
          duration: 0.5,
          stagger: 0.07,
          ease: "back.out(1.4)",
        })
      }, sectionRef)
    }).catch(() => {
      // بسته gsap لود نشد (مثلا هنوز npm install اجرا نشده)؛ بی‌صدا رد می‌شویم، انیمیشن فقط اجرا نمی‌شود
    })
    return () => ctx?.revert()
  }, [occasions])

  if (occasions.length === 0) return null

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between sm:mb-10">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
            <PartyPopper className="h-3.5 w-3.5" />
            سبد مناسبتی
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">هدیه‌ای برای هر مناسبت</h2>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            سبد میوه مخصوص تولد، عروسی، ختم، عید و هر مناسبت دیگه
          </p>
        </div>
        <Link href="/occasions" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-emerald-700 hover:underline sm:flex">
          مشاهده همه
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {occasions.map((occ) => (
          <Link
            key={occ._id}
            href={`/occasions/${occ.slug}`}
            className={`occasion-card group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-center shadow-sm transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg sm:h-36 ${occ.color}`}
          >
            <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/10" />
            <PartyPopper className="mb-2 h-6 w-6 text-white/90" />
            <span className="relative text-sm font-bold text-white sm:text-base">{occ.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link href="/occasions" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
          مشاهده همه مناسبت‌ها
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
