import mongoose, { Schema, models, model } from "mongoose"

export interface AdminDocument extends mongoose.Document {
  username: string
  passwordHash: string
  fullName: string
  role: "superadmin" | "manager"
  isActive: boolean
  lastLoginAt?: Date
  loginAttempts: number
  lockUntil?: Date
  createdAt: Date
}

const AdminSchema = new Schema<AdminDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 40,
    },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, enum: ["superadmin", "manager"], default: "manager" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    // برای محافظت در برابر brute-force روی لاگین ادمین
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export default (models.Admin as mongoose.Model<AdminDocument>) ||
  model<AdminDocument>("Admin", AdminSchema)
