import { z } from "zod"

export const setupAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "نام کاربری حداقل ۳ کاراکتر باشد")
    .max(40)
    .regex(/^[a-z0-9_.-]+$/, "نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد، نقطه، خط تیره و زیرخط باشد"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .max(200)
    .regex(/[A-Za-z]/, "رمز عبور باید حداقل یک حرف انگلیسی داشته باشد")
    .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد"),
  fullName: z.string().trim().min(2, "نام و نام خانوادگی حداقل ۲ کاراکتر باشد").max(100),
})
