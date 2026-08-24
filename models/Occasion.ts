import mongoose, { Schema, models, model } from "mongoose"

export interface OccasionDocument extends mongoose.Document {
  slug: string
  name: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const OccasionSchema = new Schema<OccasionDocument>(
  {
    slug: {
      type: String,
      required: [true, "اسلاگ مناسبت الزامی است"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"],
    },
    name: {
      type: String,
      required: [true, "نام مناسبت الزامی است"],
      trim: true,
      maxlength: [60, "نام مناسبت حداکثر ۶۰ کاراکتر می‌تواند باشد"],
    },
    description: { type: String, trim: true, maxlength: 300 },
    icon: { type: String, trim: true },
    color: { type: String, trim: true, default: "from-rose-500 to-pink-600" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

OccasionSchema.index({ isActive: 1, sortOrder: 1 })

export default (models.Occasion as mongoose.Model<OccasionDocument>) ||
  model<OccasionDocument>("Occasion", OccasionSchema)
