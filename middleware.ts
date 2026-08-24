import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME } from "@/lib/auth"

// توجه: jsonwebtoken روی Edge Runtime کار نمی‌کند، بنابراین اینجا فقط وجود کوکی را
// بررسی می‌کنیم (احراز هویت سبک/اولیه). اعتبارسنجی کامل و امن توکن (امضا + انقضا)
// داخل خود route handlerها با requireAdmin() در Node runtime انجام می‌شود.
// این یعنی حتی اگر کسی کوکی جعلی بسازد، در لایه دوم (route handler) رد می‌شود.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login" && pathname !== "/api/admin/setup"
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/setup"

  if (!isAdminApi && !isAdminPage) return NextResponse.next()

  const hasSession = Boolean(req.cookies.get(ADMIN_COOKIE_NAME)?.value)

  if (!hasSession) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: { message: "برای این عملیات ابتدا وارد پنل ادمین شوید.", code: "UNAUTHORIZED" } },
        { status: 401 }
      )
    }
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
