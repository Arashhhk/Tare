import mongoose, { Schema, models, model } from "mongoose"

export interface NewsletterDocument extends mongoose.Document {
  email: string
  isActive: boolean
  createdAt: Date
}

const NewsletterSchema = new Schema<NewsletterDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "ایمیل معتبر نیست"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export default (models.Newsletter as mongoose.Model<NewsletterDocument>) ||
  model<NewsletterDocument>("Newsletter", NewsletterSchema)
