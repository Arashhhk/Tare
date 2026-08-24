// انواع مشترک بین فرانت و بک‌اند
// -----------------------------------------------------------------------------

export type ObjectIdString = string

export interface IOccasion {
  _id: ObjectIdString
  slug: string // مثلا: birthday, wedding, funeral, new-year
  name: string // نام فارسی: تولد، عروسی، ختم، عید نوروز
  description?: string
  icon?: string // نام آیکون lucide یا مسیر svg
  color?: string // برای بج/گرادیان در UI
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ICategory {
  _id: ObjectIdString
  slug: string
  name: string
  description?: string
  image?: string
  color?: string
  subCategories: string[] // مثل قبل: 'کمیاب', 'آب میوه', ...
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type ProductUnit = "کیلو" | "عدد" | "بسته" | "کارتن" | "گرم"

export interface IProduct {
  _id: ObjectIdString
  name: string
  slug: string
  category: ObjectIdString // ref Category
  lowCategories: string[] // زیردسته (subCategory) رشته‌ای مثل قبل
  occasions: ObjectIdString[] // ref Occasion[] — یک محصول می‌تونه چند مناسبت داشته باشه
  price: number
  originalPrice?: number
  unit: ProductUnit
  minOrderQty: number // حداقل سفارش (مثلا 100 گرم)
  stepQty: number // پله‌ی افزایش سفارش (manyoffer قبلی)
  images: string[]
  rating: number
  ratingCount: number
  purchaseCount: number // countbuy قبلی
  inStock: boolean
  stockQuantity: number
  isSpecialOffer: boolean
  isBestSeller: boolean
  isDailyDeal: boolean
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IGiftBasketItem {
  product: ObjectIdString
  quantity: number
}

export interface IGiftBasket {
  _id: ObjectIdString
  name: string // مثلا "سبد میوه عروسی لوکس"
  slug: string
  occasion: ObjectIdString // ref Occasion
  description?: string
  image?: string
  items: IGiftBasketItem[]
  price: number // قیمت نهایی سبد (می‌تونه با تخفیف از جمع اقلام فرق کنه)
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | "pending" // در انتظار تایید
  | "confirmed" // تایید شده
  | "processing" // در حال آماده‌سازی
  | "shipped" // ارسال شده
  | "delivered" // تحویل داده شده
  | "cancelled" // لغو شده

export interface IOrderItem {
  product: ObjectIdString
  name: string // اسنپ‌شات نام محصول در لحظه سفارش
  price: number // اسنپ‌شات قیمت در لحظه سفارش
  quantity: number
  unit: ProductUnit
}

export interface IOrder {
  _id: ObjectIdString
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: IOrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: "unpaid" | "paid"
  paymentMethod: "cod" | "online"
  notes?: string
  viewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface IAdmin {
  _id: ObjectIdString
  username: string
  fullName: string
  role: "superadmin" | "manager"
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

// -----------------------------------------------------------------------------
// پاسخ‌های استاندارد API
export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    totalPages?: number
  }
}

export interface ApiError {
  success: false
  error: {
    message: string
    code?: string
    fields?: Record<string, string>
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
