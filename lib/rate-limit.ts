/**
 * محدودکننده نرخ درخواست ساده و در-حافظه.
 * توجه: در محیط سرورلس/چند-اینستنسی این حافظه بین اینستنس‌ها مشترک نیست،
 * بنابراین لایه اصلی امنیت لاگین (lockUntil / loginAttempts) روی خود مدل Admin
 * در دیتابیس نگه داشته می‌شود؛ این ماژول فقط یک لایه دفاعی اضافه در سطح پراسس است.
 * برای پروداکشن با ترافیک بالا پیشنهاد می‌شود از Upstash Redis یا مشابه استفاده شود.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  bucket.count += 1
  return { allowed: true, remaining: limit - bucket.count }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "unknown"
}
