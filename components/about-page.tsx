import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Truck, ShieldCheck, HeartHandshake } from "lucide-react"


const values = [
  { icon: Leaf, title: "تازگی تضمینی", description: "دست‌چین روزانه از باغ و مزرعه تا سبد شما", color: "from-emerald-500 to-green-600" },
  { icon: Truck, title: "ارسال سریع", description: "تحویل در کمترین زمان ممکن به سراسر شهر", color: "from-blue-500 to-cyan-500" },
  { icon: ShieldCheck, title: "ضمانت کیفیت", description: "بازگشت وجه در صورت نارضایتی از کیفیت محصول", color: "from-amber-500 to-orange-500" },
  { icon: HeartHandshake, title: "قیمت منصفانه", description: "قیمت مستقیم از تره‌بار مرکزی، بدون واسطه اضافه", color: "from-rose-500 to-pink-500" },
]

const stats = [
  { label: "سال فعالیت", value: "۸+" },
  { label: "مشتری راضی", value: "۱۵,۰۰۰+" },
  { label: "محصول متنوع", value: "۲۰۰+" },
  { label: "سفارش موفق", value: "۵۰,۰۰۰+" },
]

export function AboutPage() {
  return (
    <div className="min-h-screen container">
      <section className="relative max-w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-neutral-900 text-white mt-10 py-16 sm:py-20 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 industrial-pattern opacity-10"></div>
        <div className="mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-emerald-500">درباره تره‌بار</Badge>
            <h1 className="mb-6 text-3xl font-bold sm:text-5xl">تازگی و طراوت، مستقیم به دست شما</h1>
            <p className="text-lg leading-relaxed text-neutral-300 sm:text-xl">
              تره‌بار با هدف ارائه میوه و سبزیجات تازه، با قیمت منصفانه و بدون واسطه، در کنار شماست
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-neutral-200 p-4 text-center sm:p-6">
              <p className="text-2xl font-bold text-emerald-700 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white rounded-2xl">
        <div className="mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl">ارزش‌های ما</h2>
            <p className="mt-2 text-neutral-500">چیزی که تره‌بار را متفاوت می‌کند</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title} className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${v.color}`}>
                    <v.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-800">{v.title}</h3>
                  <p className="text-sm text-neutral-500">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-neutral-800 sm:text-3xl">داستان ما</h2>
            <p className="leading-relaxed text-neutral-600">
              تره‌بار از دل یک مغازه‌ی کوچک میوه‌فروشی در سال ۱۳۹۵ شروع شد؛ با این باور ساده که میوه و
              سبزی تازه نباید دست چند واسطه بچرخد تا به سفره‌ی مردم برسد. امروز، بعد از سال‌ها همکاری
              مستقیم با کشاورزان و باغداران، تره‌بار توانسته با حذف واسطه‌های اضافه، تازه‌ترین محصولات
              را با منصفانه‌ترین قیمت به هزاران خانواده برساند — و همچنان به همان اصل اول وفادار مانده:
              کیفیت اول، قیمت منصفانه، بدون سازش.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img src="/placeholder.svg" alt="درباره تره‌بار" className="h-64 w-full object-cover sm:h-80" />
          </div>
        </div>
      </section>
    </div>
  )
}
