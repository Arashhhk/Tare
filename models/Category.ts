import mongoose, { Schema, models, model } from "mongoose"

export interface CategoryDocument extends mongoose.Document {
  slug: string
  name: string
  description?: string
  image?: string
  color?: string
  subCategories: string[]
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"],
    },
    name: { type: String, required: [true, "نام دسته الزامی است"], trim: true, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 500 },
    image: { type: String, trim: true },
    color: { type: String, trim: true, default: "from-amber-500 to-amber-600" },
    subCategories: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

CategorySchema.index({ isActive: 1, sortOrder: 1 })

export default (models.Category as mongoose.Model<CategoryDocument>) ||
  model<CategoryDocument>("Category", CategorySchema)
