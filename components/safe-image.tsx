"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

interface SafeImageProps {
  src?: string
  alt: string
  className?: string
  fallbackClassName?: string
  loading?: "lazy" | "eager"
}

/**
 * حتی اگر مسیر ذخیره‌شده در دیتابیس (مثلاً به‌خاطر یک باگ قدیمی) اشتباه باشد، اینجا آخرین
 * نقطه‌ی دفاعی است: پیشوند اشتباه "public/" یا نبود اسلش ابتدایی را در لحظه‌ی نمایش هم پاک
 * می‌کند، مستقل از این‌که رکورد در دیتابیس چه زمانی و چگونه ذخیره شده است.
 */
function sanitizeSrc(src?: string): string | undefined {
  if (!src) return src
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src
  let cleaned = src.replace(/^\/?public\//i, "/")
  if (!cleaned.startsWith("/")) cleaned = `/${cleaned}`
  return cleaned
}

/**
 * جایگزین امن برای تگ <img> ساده. اگر مسیر عکس اشتباه باشد یا فایل در public/ وجود نداشته
 * باشد، به‌جای آیکون شکسته‌ی مرورگر (که وقتی با object-cover کش داده می‌شود کوچک و تار به نظر
 * می‌رسد) یک placeholder تمیز و هم‌اندازه نشان می‌دهد.
 */
export function SafeImage({ src, alt, className, fallbackClassName, loading = "lazy" }: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const resolvedSrc = sanitizeSrc(src)

  if (!resolvedSrc || failed) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 text-neutral-300 ${fallbackClassName ?? className ?? ""}`}>
        <ImageOff className="h-8 w-8" />
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
