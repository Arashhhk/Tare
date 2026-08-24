import mongoose, { Schema, models, model } from "mongoose"

export interface ProductDocument extends mongoose.Document {
  name: string
  slug: string
  category: mongoose.Types.ObjectId
  lowCategories: string[]
  occasions: mongoose.Types.ObjectId[]
  price: number
  originalPrice?: number
  unit: string
  minOrderQty: number
  stepQty: number
  images: string[]
  rating: number
  ratingCount: number
  purchaseCount: number
  inStock: boolean
  stockQuantity: number
  isSpecialOffer: boolean
  isBestSeller: boolean
  isDailyDeal: boolean
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: [true, "نام محصول الزامی است"], trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: [true, "دسته‌بندی الزامی است"] },
    lowCategories: { type: [String], default: [] },
    occasions: [{ type: Schema.Types.ObjectId, ref: "Occasion" }],
    price: { type: Number, required: [true, "قیمت الزامی است"], min: [0, "قیمت نمی‌تواند منفی باشد"] },
    originalPrice: { type: Number, min: 0 },
    unit: {
      type: String,
      enum: ["کیلو", "عدد", "بسته", "کارتن", "گرم"],
      default: "کیلو",
    },
    minOrderQty: { type: Number, default: 100, min: 1 },
    stepQty: { type: Number, default: 1, min: 1 },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    purchaseCount: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0, min: 0 },
    isSpecialOffer: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isDailyDeal: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// ایندکس‌های پرکاربرد برای سرعت فیلتر و جستجو
ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ lowCategories: 1 })
ProductSchema.index({ occasions: 1, isActive: 1 })
ProductSchema.index({ isSpecialOffer: 1, isActive: 1 })
ProductSchema.index({ isBestSeller: 1, isActive: 1 })
ProductSchema.index({ isDailyDeal: 1, isActive: 1 })
ProductSchema.index({ name: "text", description: "text" })

export default (models.Product as mongoose.Model<ProductDocument>) ||
  model<ProductDocument>("Product", ProductSchema)
