import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import Admin from "@/models/Admin"
import { verifyPassword, signAdminToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS } from "@/lib/auth"
import { ok, fail, serverError } from "@/lib/api-response"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

const loginSchema = z.object({
  username: z.string().min(3).max(40),
  password: z.string().min(6).max(200),
})

const MAX_ATTEMPTS = 5
const LOCK_MINUTES = 15

export async function POST(req: NextRequest) {
  try {
    // محدودسازی نرخ درخواست بر اساس IP برای جلوگیری از brute-force
    const ip = getClientIp(req.headers)
    const { allowed } = rateLimit(`login:${ip}`, 10, 60_000) // حداکثر ۱۰ تلاش در دقیقه از هر IP
    if (!allowed) {
      return fail("تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.", 429, "RATE_LIMITED")
    }

    const body = await req.json().catch(() => null)
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return fail("نام کاربری یا رمز عبور نامعتبر است.", 400, "VALIDATION_ERROR")
    }
    const { username, password } = parsed.data

    await connectDB()
    const admin = await Admin.findOne({ username: username.toLowerCase() }).select("+passwordHash")

    // پیام خطای یکسان برای کاربر نامعتبر و رمز اشتباه (جلوگیری از user enumeration)
    const genericError = () => fail("نام کاربری یا رمز عبور اشتباه است.", 401, "INVALID_CREDENTIALS")

    if (!admin || !admin.isActive) return genericError()

    if (admin.lockUntil && admin.lockUntil.getTime() > Date.now()) {
      const minutesLeft = Math.ceil((admin.lockUntil.getTime() - Date.now()) / 60000)
      return fail(`حساب موقتاً قفل شده است. ${minutesLeft} دقیقه دیگر دوباره تلاش کنید.`, 423, "ACCOUNT_LOCKED")
    }

    const passwordValid = await verifyPassword(password, admin.passwordHash)
    if (!passwordValid) {
      admin.loginAttempts += 1
      if (admin.loginAttempts >= MAX_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60_000)
        admin.loginAttempts = 0
      }
      await admin.save()
      return genericError()
    }

    // ورود موفق: ریست شمارنده و ثبت زمان آخرین ورود
    admin.loginAttempts = 0
    admin.lockUntil = undefined
    admin.lastLoginAt = new Date()
    await admin.save()

    const token = signAdminToken({
      adminId: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    })

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS)

    return ok({
      admin: {
        id: admin._id.toString(),
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
      },
    })
  } catch (err) {
    return serverError(err)
  }
}

export async function DELETE() {
  // خروج از حساب ادمین
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  return ok({ loggedOut: true })
}
