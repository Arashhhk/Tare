import { NextResponse } from "next/server"
import type { ApiError, ApiSuccess } from "@/types"

export function ok<T>(data: T, meta?: ApiSuccess<T>["meta"], status = 200) {
  const body: ApiSuccess<T> = { success: true, data, ...(meta ? { meta } : {}) }
  return NextResponse.json(body, { status })
}

export function fail(message: string, status = 400, code?: string, fields?: Record<string, string>) {
  const body: ApiError = { success: false, error: { message, code, fields } }
  return NextResponse.json(body, { status })
}

// خطای غیرمنتظره سرور را بدون افشای جزئیات داخلی برمی‌گرداند (امنیت)
export function serverError(err: unknown) {
  console.error("[API_ERROR]", err)
  return fail("خطای داخلی سرور رخ داد. لطفاً بعداً دوباره تلاش کنید.", 500, "INTERNAL_ERROR")
}

export function unauthorized(message = "برای این عملیات ابتدا وارد شوید.") {
  return fail(message, 401, "UNAUTHORIZED")
}

export function forbidden(message = "شما دسترسی لازم برای این عملیات را ندارید.") {
  return fail(message, 403, "FORBIDDEN")
}

export function notFound(message = "مورد درخواستی یافت نشد.") {
  return fail(message, 404, "NOT_FOUND")
}
