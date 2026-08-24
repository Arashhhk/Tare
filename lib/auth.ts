import bcrypt from "bcryptjs"
import jwt, { type JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = "8h" // نشست ادمین بعد از ۸ ساعت منقضی می‌شود

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "متغیر محیطی JWT_SECRET تعریف نشده یا خیلی کوتاه است (حداقل ۳۲ کاراکتر تصادفی لازم است)."
  )
}

export interface AdminTokenPayload extends JwtPayload {
  adminId: string
  username: string
  role: "superadmin" | "manager"
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload
  } catch {
    return null
  }
}

export const ADMIN_COOKIE_NAME = "tare_admin_session"

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true, // غیرقابل دسترس از جاوااسکریپت سمت کلاینت -> امن در برابر XSS
  secure: process.env.NODE_ENV === "production", // فقط HTTPS در پروداکشن
  sameSite: "lax" as const, // محافظت پایه در برابر CSRF
  path: "/",
  maxAge: 60 * 60 * 8, // ۸ ساعت، هم‌راستا با انقضای JWT
}
