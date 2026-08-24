import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error(
    "متغیر محیطی MONGODB_URI تعریف نشده. فایل .env.local را بر اساس .env.example بسازید."
  )
}

/**
 * در Next.js هر route handler ممکنه جدا اجرا بشه (سرورلس) یا در dev هات‌ریلود بشه،
 * برای همین کانکشن رو روی globalThis کش می‌کنیم تا هر بار کانکشن جدید به مونگو باز نشه.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null }
global._mongooseCache = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((m) => m)
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}

export default connectDB
