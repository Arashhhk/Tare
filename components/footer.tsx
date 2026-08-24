import Link from "next/link"
import { Phone, Mail, MapPin, Instagram } from "lucide-react"


export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm sm:text-base">ت</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">تره بار</h3>
                <p className="text-xs sm:text-sm text-neutral-400">ارزان‌تر از همه جا</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-md">
              ارائه‌دهنده انواع میوه، صیفی‌جات و سبزی با کیفیت باورنکردنی و قیمتی بی‌رقیب، همراه با سبدهای مناسبتی
              آماده برای هر رویداد خاص.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors p-1" aria-label="اینستاگرام">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">دسترسی سریع</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 sm:space-y-0 sm:gap-y-2">
              <li>
                <Link href="/" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">صفحه اصلی</Link>
              </li>
              <li>
                <Link href="/products" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">محصولات</Link>
              </li>
              <li>
                <Link href="/occasions" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">سبد مناسبتی</Link>
              </li>
              <li>
                <Link href="/special-offers" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">فروش ویژه</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">درباره ما</Link>
              </li>
              <li className="col-span-2 sm:col-span-1">
                <Link href="/contact" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">تماس با ما</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">اطلاعات تماس</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm sm:text-base text-neutral-400" dir="ltr">021-91300512</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm sm:text-base text-neutral-400 break-all" dir="ltr">info@tarebar.ir</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-neutral-400 leading-relaxed">تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۵</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-neutral-400">© {new Date().getFullYear()} تره بار. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}
