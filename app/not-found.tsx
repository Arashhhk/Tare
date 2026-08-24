import Link from "next/link"
import { Carrot, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <Carrot className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="mb-2 text-6xl font-bold text-emerald-700">۴۰۴</h1>
      <h2 className="mb-3 text-xl font-bold text-neutral-800 sm:text-2xl">این صفحه رو تو سبد پیدا نکردیم!</h2>
      <p className="mb-8 max-w-sm text-neutral-500">
        شاید لینک اشتباه بوده یا این محصول دیگه موجود نیست. برگرد به فروشگاه و ادامه‌ی خرید رو شروع کن.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Home className="h-4 w-4" />
          صفحه اصلی
        </Link>
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          <Search className="h-4 w-4" />
          مشاهده محصولات
        </Link>
      </div>
    </div>
  )
}
