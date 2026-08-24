import mongoose, { Schema, models, model } from "mongoose"

export interface OrderItem {
  product: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  unit: string
}

export interface OrderDocument extends mongoose.Document {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "unpaid" | "paid"
  paymentMethod: "cod" | "online"
  notes?: string
  viewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
  },
  { _id: false }
)

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: [true, "نام مشتری الزامی است"], trim: true, maxlength: 100 },
    customerPhone: {
      type: String,
      required: [true, "شماره تماس الزامی است"],
      trim: true,
      match: [/^09\d{9}$/, "شماره موبایل معتبر نیست"],
    },
    customerAddress: { type: String, required: [true, "آدرس الزامی است"], trim: true, maxlength: 500 },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: (v: OrderItem[]) => v.length > 0,
        message: "سفارش باید حداقل یک قلم کالا داشته باشد",
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    // پرداخت مفهومی جدا از وضعیت سفارش است: سفارش می‌تواند تایید/آماده شود ولی هنوز پرداختش
    // (نقدی هنگام تحویل) دریافت نشده باشد. ادمین این را دستی بعد از دریافت وجه علامت می‌زند.
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    notes: { type: String, trim: true, maxlength: 500 },
    // زمانی که ادمین برای اولین‌بار جزئیات سفارش را باز کند ثبت می‌شود -> مبنای نشان «سفارش جدید»
    viewedAt: { type: Date },
  },
  { timestamps: true }
)

OrderSchema.index({ status: 1, createdAt: -1 })
OrderSchema.index({ customerPhone: 1 })
OrderSchema.index({ viewedAt: 1 })

export default (models.Order as mongoose.Model<OrderDocument>) ||
  model<OrderDocument>("Order", OrderSchema)
