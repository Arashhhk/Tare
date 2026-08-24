import Link from "next/link"
import type { Metadata } from "next"
import { Cog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { getActiveCategories } from "@/lib/server-data"

// همیشه داینامیک: مستقیم از دیتابیس می‌خواند تا تغییرات پنل ادمین بلافاصله دیده شود
export const dynamic = "force-dynamic"


export const metadata: Metadata = { title: "دسته‌بندی محصولات | تره‌بار" }

export default async function CategoriesPage() {
  const categories = await getActiveCategories()

  return (
    <div>
      <SiteHeader />
      <div className="container">
        <div className="mx-auto px-4 py-8">
          <h2 className="mb-8 text-3xl font-bold text-neutral-800 sm:text-4xl">دسته‌بندی محصولات</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.map((category: any) => (
              <Link key={category._id} href={`/category/${category.slug}`}>
                <div className="group h-full rounded-lg border border-border p-3 transition-all duration-300 hover:border-orange-300 hover:shadow-md sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r sm:h-11 sm:w-11 ${category.color}`}>
                        <Cog className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground transition-colors group-hover:text-orange-600 sm:text-lg">
                          {category.name}
                        </h4>
                        {category.description && (
                          <p className="text-xs text-muted-foreground sm:text-sm">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                      {category.subCategories?.slice(0, 3).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
