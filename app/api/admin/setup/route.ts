import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/mongodb"
import Admin from "@/models/Admin"
import { hashPassword, signAdminToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_OPTIONS } from "@/lib/auth"
import { setupAdminSchema } from "@/lib/setup-validation"
import { ok, fail, serverError } from "@/lib/api-response"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

/**
 * این روت عمداً بدون نیاز به احراز هویت در دسترس است، چون هدفش دقیقاً ساخت *اولین* ادمین است.
 * تنها محافظت لازم این است که به محض وجود حتی یک ادمین در دیتابیس، برای همیشه غیرفعال شود؛
 * این بررسی (adminCount > 0) در همه‌ی حالت‌ها (GET و POST) انجام می‌شود.
 */

export async function GET() {
  try {
    await connectDB()
    const adminCount = await Admin.countDocuments()
    return ok({ setupRequired: adminCount === 0 })
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const { allowed } = rateLimit(`setup:${ip}`, 5, 60_000)
    if (!allowed) {
      return fail("تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.", 429, "RATE_LIMITED")
    }

    await connectDB()
    const adminCount = await Admin.countDocuments()
    if (adminCount > 0) {
      return fail(
        "راه‌اندازی اولیه قبلاً انجام شده و حداقل یک حساب ادمین وجود دارد. از صفحه ورود استفاده کنید.",
        403,
        "SETUP_ALREADY_DONE"
      )
    }

    const body = await req.json().catch(() => null)
    const parsed = setupAdminSchema.safeParse(body)
    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] = issue.message
      return fail("اطلاعات وارد شده نامعتبر است.", 400, "VALIDATION_ERROR", fields)
    }

    const { username, password, fullName } = parsed.data
    const passwordHash = await hashPassword(password)

    const admin = await Admin.create({
      username,
      passwordHash,
      fullName,
      role: "superadmin",
    })

    // بعد از ساخت موفق، بلافاصله ادمین را لاگین می‌کنیم تا مستقیم وارد پنل شود
    const token = signAdminToken({
      adminId: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    })
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS)

    return ok(
      { admin: { id: admin._id.toString(), username: admin.username, fullName: admin.fullName, role: admin.role } },
      undefined,
      201
    )
  } catch (err: any) {
    if (err?.code === 11000) {
      return fail("این نام کاربری قبلاً استفاده شده است.", 409, "DUPLICATE_USERNAME")
    }
    return serverError(err)
  }
}
