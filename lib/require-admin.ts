import { cookies } from "next/headers"
import { ADMIN_COOKIE_NAME, verifyAdminToken, type AdminTokenPayload } from "@/lib/auth"

/**
 * توکن نشست ادمین را از کوکی httpOnly می‌خواند و اعتبارسنجی می‌کند.
 * چون middleware.ts هم مسیرهای /api/admin و /admin را بررسی می‌کند، این تابع
 * به‌عنوان لایه دوم دفاعی (defense in depth) داخل خود route handler هم استفاده می‌شود.
 */
export async function getAdminFromRequest(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function requireAdmin(requiredRole?: "superadmin"): Promise<
  { ok: true; admin: AdminTokenPayload } | { ok: false; status: 401 | 403; message: string }
> {
  const admin = await getAdminFromRequest()
  if (!admin) {
    return { ok: false, status: 401, message: "برای این عملیات ابتدا وارد پنل ادمین شوید." }
  }
  if (requiredRole && admin.role !== requiredRole) {
    return { ok: false, status: 403, message: "شما دسترسی لازم برای این عملیات را ندارید." }
  }
  return { ok: true, admin }
}
