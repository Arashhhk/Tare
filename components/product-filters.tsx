"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ICategory, IOccasion } from "@/types"

interface ProductFiltersProps {
  categories: ICategory[]
  occasions: IOccasion[]
}

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
]

export function ProductFilters({ categories, occasions }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get("category")
  const activeOccasion = searchParams.get("occasion")
  const activeSort = searchParams.get("sort") ?? "newest"

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-4 lg:mt-16">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
          <button
            onClick={() => updateParam("category", null)}
            className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${!activeCategory ? "bg-emerald-50 font-medium text-emerald-700" : "text-neutral-600 hover:bg-neutral-50"}`}
          >
            همه محصولات
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam("category", cat.slug)}
              className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${activeCategory === cat.slug ? "bg-emerald-50 font-medium text-emerald-700" : "text-neutral-600 hover:bg-neutral-50"}`}
            >
              {cat.name}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">مناسبت</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
          <button
            onClick={() => updateParam("occasion", null)}
            className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${!activeOccasion ? "bg-rose-50 font-medium text-rose-700" : "text-neutral-600 hover:bg-neutral-50"}`}
          >
            همه مناسبت‌ها
          </button>
          {occasions.map((occ) => (
            <button
              key={occ._id}
              onClick={() => updateParam("occasion", occ.slug)}
              className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${activeOccasion === occ.slug ? "bg-rose-50 font-medium text-rose-700" : "text-neutral-600 hover:bg-neutral-50"}`}
            >
              {occ.name}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">مرتب‌سازی</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("sort", opt.value)}
              className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${activeSort === opt.value ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"}`}
            >
              {opt.label}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
