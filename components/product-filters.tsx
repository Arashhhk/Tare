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
  const activeSubs = searchParams.get("sub")?.split(",").filter(Boolean) ?? []
  const activeSort = searchParams.get("sort") ?? "newest"

  // اگر دسته‌بندی خاصی انتخاب شده باشد، فقط زیردسته‌های همان دسته نشان داده می‌شود؛
  // در غیر این صورت همه‌ی زیردسته‌های همه‌ی دسته‌بندی‌ها (بدون تکرار) نمایش داده می‌شود.
  const availableSubCategories = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.subCategories ?? []
    : Array.from(new Set(categories.flatMap((c) => c.subCategories)))

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  function selectCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set("category", slug)
    else params.delete("category")
    // با عوض شدن دسته‌بندی، زیردسته‌های انتخاب‌شده‌ی قبلی که ممکن است به دسته‌ی جدید تعلق نداشته باشند پاک می‌شوند
    params.delete("sub")
    router.push(`/products?${params.toString()}`)
  }

  function toggleSub(sub: string) {
    const params = new URLSearchParams(searchParams.toString())
    const next = activeSubs.includes(sub) ? activeSubs.filter((s) => s !== sub) : [...activeSubs, sub]
    if (next.length > 0) params.set("sub", next.join(","))
    else params.delete("sub")
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
            onClick={() => selectCategory(null)}
            className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${!activeCategory ? "bg-emerald-50 font-medium text-emerald-700" : "text-neutral-600 hover:bg-neutral-50"}`}
          >
            همه محصولات
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => selectCategory(cat.slug)}
              className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${activeCategory === cat.slug ? "bg-emerald-50 font-medium text-emerald-700" : "text-neutral-600 hover:bg-neutral-50"}`}
            >
              {cat.name}
            </button>
          ))}
        </CardContent>
      </Card>

      {availableSubCategories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">زیردسته</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => toggleSub(sub)}
                className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${activeSubs.includes(sub) ? "bg-amber-50 font-medium text-amber-700" : "text-neutral-600 hover:bg-neutral-50"}`}
              >
                {sub}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

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
