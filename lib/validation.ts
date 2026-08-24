import { z } from "zod"

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نامعتبر است")
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد")

export const occasionSchema = z.object({
  slug,
  name: z.string().trim().min(2, "نام مناسبت حداقل ۲ کاراکتر").max(60),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  icon: z.string().trim().max(60).optional().or(z.literal("")),
  color: z.string().trim().max(100).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})
export const occasionUpdateSchema = occasionSchema.partial()

export const categorySchema = z.object({
  slug,
  name: z.string().trim().min(2, "نام دسته حداقل ۲ کاراکتر").max(60),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  image: z.string().trim().max(300).optional().or(z.literal("")),
  color: z.string().trim().max(100).optional().or(z.literal("")),
  subCategories: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})
export const categoryUpdateSchema = categorySchema.partial()

export const productSchema = z.object({
  name: z.string().trim().min(2, "نام محصول حداقل ۲ کاراکتر").max(120),
  slug,
  category: objectId,
  lowCategories: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  occasions: z.array(objectId).max(20).optional(),
  price: z.number().min(0, "قیمت نمی‌تواند منفی باشد"),
  originalPrice: z.number().min(0).optional(),
  unit: z.enum(["کیلو", "عدد", "بسته", "کارتن", "گرم"]).optional(),
  minOrderQty: z.number().int().min(1).optional(),
  stepQty: z.number().int().min(1).optional(),
  images: z.array(z.string().trim().max(300)).max(10).optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  isSpecialOffer: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isDailyDeal: z.boolean().optional(),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
})
export const productUpdateSchema = productSchema.partial()

export const giftBasketItemSchema = z.object({
  product: objectId,
  quantity: z.number().int().min(1),
})

export const giftBasketSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug,
  occasion: objectId,
  description: z.string().trim().max(600).optional().or(z.literal("")),
  image: z.string().trim().max(300).optional().or(z.literal("")),
  items: z.array(giftBasketItemSchema).min(1, "سبد باید حداقل یک محصول داشته باشد"),
  price: z.number().min(0),
  isActive: z.boolean().optional(),
})
export const giftBasketUpdateSchema = giftBasketSchema.partial()

export const orderItemSchema = z.object({
  product: objectId,
  quantity: z.number().int().min(1),
})

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(100),
  customerPhone: z.string().trim().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09121234567)"),
  customerAddress: z.string().trim().min(10, "آدرس باید کامل‌تر وارد شود").max(500),
  items: z.array(orderItemSchema).min(1, "سبد خرید نمی‌تواند خالی باشد"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid"]).optional(),
})

export { objectId }
