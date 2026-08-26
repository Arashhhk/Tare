"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface CategoryFiltersProps {
  subCategories: string[]
}

const PRICE_MIN = 0
const PRICE_MAX = 10_000_000
const PRICE_STEP = 50_000

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

  // مقدار اسلایدر جدا از URL نگه داشته می‌شود تا حین کشیدن (drag) هر لحظه URL آپدیت نشود؛
  // فقط وقتی رها می‌کند (onValueCommit) URL و در نتیجه فیلتر واقعی روی سرور اعمال می‌شود.
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ? Number(minPrice) : PRICE_MIN,
    maxPrice ? Number(maxPrice) : PRICE_MAX,
  ])

  useEffect(() => {
    setPriceRange([minPrice ? Number(minPrice) : PRICE_MIN, maxPrice ? Number(maxPrice) : PRICE_MAX])
  }, [minPrice, maxPrice])

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

  function commitPriceRange(range: [number, number]) {
    updateParams((params) => {
      if (range[0] > PRICE_MIN) params.set("minPrice", String(range[0]))
      else params.delete("minPrice")
      if (range[1] < PRICE_MAX) params.set("maxPrice", String(range[1]))
      else params.delete("maxPrice")
    })
  }

  function formatPrice(value: number) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیون`
    return value.toLocaleString("fa-IR")
  }

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
        <CardContent>
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-neutral-700">
            <span>{formatPrice(priceRange[0])} تومان</span>
            <span className="text-neutral-300">تا</span>
            <span>{formatPrice(priceRange[1])} تومان</span>
          </div>
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommit={(value) => commitPriceRange(value as [number, number])}
            dir="rtl"
            className="mt-2"
          />
          <div className="mt-2 flex justify-between text-[11px] text-neutral-400">
            <span>۰</span>
            <span>۱۰ میلیون تومان</span>
          </div>
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
