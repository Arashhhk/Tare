import Link from "next/link"
import type { Metadata } from "next"
import { PartyPopper } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { getActiveOccasions } from "@/lib/server-data"

// همیشه داینامیک: مستقیم از دیتابیس می‌خواند تا تغییرات پنل ادمین بلافاصله دیده شود
export const dynamic = "force-dynamic"


export const metadata: Metadata = {
  title: "سبد مناسبتی | تره‌بار",
  description: "سبد میوه مناسب برای تولد، عروسی، ختم، عید نوروز و هر مناسبت دیگر",
}

export default async function OccasionsPage() {
  const occasions = await getActiveOccasions()

  return (
    <div>
      <SiteHeader />
      <div className="container">
        <div className="mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
              <PartyPopper className="h-3.5 w-3.5" />
              سبد مناسبتی
            </div>
            <h1 className="mb-2 text-3xl font-bold text-neutral-800 sm:text-4xl">هدیه‌ای برای هر مناسبت</h1>
            <p className="text-lg text-neutral-600">مناسبت خودتون رو انتخاب کنید تا بهترین محصولات رو ببینید</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {occasions.map((occ: any) => (
              <Link
                key={occ._id}
                href={`/occasions/${occ.slug}`}
                className={`group relative flex h-36 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-center shadow-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg sm:h-40 ${occ.color}`}
              >
                <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/10" />
                <PartyPopper className="mb-2 h-7 w-7 text-white/90" />
                <span className="relative text-base font-bold text-white sm:text-lg">{occ.name}</span>
                {occ.description && (
                  <span className="relative mt-1 text-xs text-white/80 line-clamp-2">{occ.description}</span>
                )}
              </Link>
            ))}
          </div>

          {occasions.length === 0 && (
            <p className="py-16 text-center text-neutral-500">هنوز مناسبتی ثبت نشده است.</p>
          )}
        </div>
      </div>
    </div>
  )
}
