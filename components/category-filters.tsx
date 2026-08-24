"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryFiltersProps {
  subCategories: string[]
}

const PRICE_RANGES = [
  { label: "همه قیمت‌ها", min: undefined, max: undefined },
  { label: "زیر ۵۰,۰۰۰ تومان", min: undefined, max: 50000 },
  { label: "۵۰,۰۰۰ تا ۱۵۰,۰۰۰ تومان", min: 50000, max: 150000 },
  { label: "۱۵۰,۰۰۰ تا ۳۰۰,۰۰۰ تومان", min: 150000, max: 300000 },
  { label: "بالای ۳۰۰,۰۰۰ تومان", min: 300000, max: undefined },
]

const TAG_OPTIONS = [
  { value: "special", label: "پیشنهاد ویژه" },
  { value: "bestseller", label: "پرفروش" },
  { value: "daily", label: "پیشنهاد روزانه" },
]

export function CategoryFilters({ subCategories }: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeSubs = searchParams.get("sub")?.split(",").filter(Boolean) ?? []
  const activeTags = searchParams.get("tags")?.split(",").filter(Boolean) ?? []
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString())
    mutator(params)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  function toggleSub(sub: string) {
    updateParams((params) => {
      const next = activeSubs.includes(sub) ? activeSubs.filter((s) => s !== sub) : [...activeSubs, sub]
      if (next.length > 0) params.set("sub", next.join(","))
      else params.delete("sub")
    })
  }

  function toggleTag(tag: string) {
    updateParams((params) => {
      const next = activeTags.includes(tag) ? activeTags.filter((t) => t !== tag) : [...activeTags, tag]
      if (next.length > 0) params.set("tags", next.join(","))
      else params.delete("tags")
    })
  }

  function applyPriceRange(min?: number, max?: number) {
    updateParams((params) => {
      if (min !== undefined) params.set("minPrice", String(min))
      else params.delete("minPrice")
      if (max !== undefined) params.set("maxPrice", String(max))
      else params.delete("maxPrice")
    })
  }

  const isActivePriceRange = (min?: number, max?: number) =>
    (min === undefined ? !minPrice : minPrice === String(min)) && (max === undefined ? !maxPrice : maxPrice === String(max))

  const hasActiveFilters = activeSubs.length > 0 || activeTags.length > 0 || minPrice || maxPrice

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <button
          onClick={() => router.push("?", { scroll: false })}
          className="w-full rounded-xl border border-neutral-200 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
        >
          پاک کردن همه فیلترها
        </button>
      )}

      {subCategories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">زیردسته</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
            {subCategories.map((sub) => {
              const active = activeSubs.includes(sub)
              return (
                <button
                  key={sub}
                  onClick={() => toggleSub(sub)}
                  className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${
                    active ? "bg-amber-50 font-medium text-amber-700 ring-1 ring-amber-200" : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {sub}
                </button>
              )
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">بازه قیمت</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => applyPriceRange(range.min, range.max)}
              className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${
                isActivePriceRange(range.min, range.max)
                  ? "bg-emerald-50 font-medium text-emerald-700 ring-1 ring-emerald-200"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">نوع محصول</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
          {TAG_OPTIONS.map((tag) => {
            const active = activeTags.includes(tag.value)
            return (
              <button
                key={tag.value}
                onClick={() => toggleTag(tag.value)}
                className={`rounded-lg px-3 py-1.5 text-right text-sm transition ${
                  active ? "bg-rose-50 font-medium text-rose-700 ring-1 ring-rose-200" : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {tag.label}
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
