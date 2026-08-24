/**
 * ورودی ادمین برای اسم فایل عکس را به یک مسیر معتبر در public/ تبدیل می‌کند.
 * هر ورودی احتمالی اشتباه (اسلش اول، پیشوند "public/"، پسوند تکراری، فاصله) را پاکسازی می‌کند
 * تا خروجی همیشه دقیقاً به‌شکل "/filename.jpg" باشد.
 */
export function normalizeImagePath(raw: string): string | null {
  const cleanName = raw
    .trim()
    .replace(/^\/+/, "") // حذف اسلش ابتدایی احتمالی
    .replace(/^public[\\/]+/i, "") // حذف پیشوند "public/" اگر کسی اشتباهی اضافه کرده باشد
    .replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, "") // حذف پسوند احتمالی که خودش تایپ کرده
    .replace(/\s+/g, "-") // فاصله در نام فایل مشکل‌ساز است
    .trim()

  if (!cleanName) return null
  return `/${cleanName}.jpg`
}
