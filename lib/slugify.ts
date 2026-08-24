// نگاشت حروف فارسی/عربی به معادل لاتین (Finglish) برای ساخت اسلاگ خوانا از عنوان فارسی.
// بدون این نگاشت، عنوان‌های کاملاً فارسی بعد از حذف کاراکترهای غیرمجاز به رشته‌ی خالی
// تبدیل می‌شدند و اعتبارسنجی اسلاگ (که حداقل ۲ کاراکتر لاتین می‌خواهد) رد می‌شد —
// همان دلیلی که اجازه‌ی ثبت دسته‌بندی/محصول با عنوان فارسی را نمی‌داد.
const PERSIAN_TO_LATIN: Record<string, string> = {
  "آ": "a", "ا": "a", "أ": "a", "إ": "e", "ئ": "e", "ؤ": "o", "ء": "",
  "ب": "b", "پ": "p", "ت": "t", "ث": "s", "ج": "j", "چ": "ch",
  "ح": "h", "خ": "kh", "د": "d", "ذ": "z", "ر": "r", "ز": "z", "ژ": "zh",
  "س": "s", "ش": "sh", "ص": "s", "ض": "z", "ط": "t", "ظ": "z",
  "ع": "a", "غ": "gh", "ف": "f", "ق": "gh", "ک": "k", "گ": "g",
  "ل": "l", "م": "m", "ن": "n", "و": "v", "ه": "h", "ی": "y", "ة": "h",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
}

function transliteratePersian(text: string): string {
  return text
    .split("")
    .map((ch) => PERSIAN_TO_LATIN[ch] ?? ch)
    .join("")
}

/**
 * از یک عنوان فارسی یا انگلیسی، اسلاگ URL-safe و همیشه معتبر می‌سازد.
 * اگر بعد از تبدیل و پاکسازی چیزی باقی نماند (مثلاً عنوان فقط از کاراکترهای خاص تشکیل شده)،
 * یک پسوند تصادفی اضافه می‌شود تا هیچ‌وقت خروجی خالی یا نامعتبر نداشته باشیم.
 */
export function slugify(text: string): string {
  const withoutZwnj = text.replace(/\u200c/g, " ") // نیم‌فاصله را قبل از ترجمه به فاصله تبدیل می‌کنیم
  const transliterated = transliteratePersian(withoutZwnj)
  const cleaned = transliterated
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  if (cleaned.length >= 2) return cleaned

  const randomSuffix = Math.random().toString(36).slice(2, 8)
  return cleaned ? `${cleaned}-${randomSuffix}` : `item-${randomSuffix}`
}
