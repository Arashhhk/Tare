import mongoose, { Schema, models, model } from "mongoose"

export interface GiftBasketItem {
  product: mongoose.Types.ObjectId
  quantity: number
}

export interface GiftBasketDocument extends mongoose.Document {
  name: string
  slug: string
  occasion: mongoose.Types.ObjectId
  description?: string
  image?: string
  items: GiftBasketItem[]
  price: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const GiftBasketItemSchema = new Schema<GiftBasketItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
)

const GiftBasketSchema = new Schema<GiftBasketDocument>(
  {
    name: { type: String, required: [true, "نام سبد الزامی است"], trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    occasion: { type: Schema.Types.ObjectId, ref: "Occasion", required: [true, "مناسبت سبد الزامی است"] },
    description: { type: String, trim: true, maxlength: 600 },
    image: { type: String, trim: true },
    items: {
      type: [GiftBasketItemSchema],
      validate: {
        validator: (v: GiftBasketItem[]) => v.length > 0,
        message: "سبد مناسبتی باید حداقل یک محصول داشته باشد",
      },
    },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

GiftBasketSchema.index({ occasion: 1, isActive: 1 })

export default (models.GiftBasket as mongoose.Model<GiftBasketDocument>) ||
  model<GiftBasketDocument>("GiftBasket", GiftBasketSchema)
