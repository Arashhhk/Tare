/**
 * اسکریپت مقداردهی اولیه دیتابیس.
 * اجرا: npx tsx scripts/seed.ts
 * (نیازمند .env.local با MONGODB_URI و JWT_SECRET)
 */
import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import Category from "../models/Category"
import Occasion from "../models/Occasion"
import Product from "../models/Product"
import Admin from "../models/Admin"

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI تعریف نشده است. فایل .env.local را بسازید.")

  await mongoose.connect(uri)
  console.log("✓ به دیتابیس متصل شد")

  // --- مناسبت‌ها ---
  const occasionsData = [
    { slug: "birthday", name: "تولد", color: "from-pink-500 to-rose-600", sortOrder: 1 },
    { slug: "wedding", name: "عروسی", color: "from-purple-500 to-fuchsia-600", sortOrder: 2 },
    { slug: "funeral", name: "ختم و تسلیت", color: "from-slate-500 to-slate-700", sortOrder: 3 },
    { slug: "new-year", name: "عید نوروز", color: "from-emerald-500 to-green-600", sortOrder: 4 },
    { slug: "guest", name: "پذیرایی مهمانی", color: "from-amber-500 to-orange-600", sortOrder: 5 },
    { slug: "get-well", name: "عیادت بیمار", color: "from-sky-500 to-blue-600", sortOrder: 6 },
  ]
  const occasions: Record<string, string> = {}
  for (const o of occasionsData) {
    const doc = await Occasion.findOneAndUpdate({ slug: o.slug }, o, { upsert: true, new: true })
    occasions[o.slug] = doc._id.toString()
  }
  console.log(`✓ ${occasionsData.length} مناسبت ثبت شد`)

  // --- دسته‌بندی‌ها ---
  const categoriesData = [
    {
      slug: "fruit",
      name: "میوه",
      image: "/frouit.jpg",
      color: "from-amber-500 to-amber-600",
      subCategories: ["کمیاب", "آب میوه", "زمستانی", "پاییزی", "تابستانی", "بهاری", "همیشگی"],
      description: "میوه‌های باکیفیت دست‌چین با بهترین قیمت",
      sortOrder: 1,
    },
    {
      slug: "seifi",
      name: "صیفی‌جات",
      image: "/seifi.jpg",
      color: "from-yellow-500 to-yellow-600",
      subCategories: ["روزانه", "رژیمی", "فرآوری‌شده"],
      description: "صیفی‌جات تازه و باکیفیت",
      sortOrder: 2,
    },
    {
      slug: "sabzi",
      name: "سبزیجات",
      image: "/sabzi.jpg",
      color: "from-orange-600 to-red-600",
      subCategories: ["رژیمی", "خورشتی", "خوردنی"],
      description: "سبزیجات تازه با آبیاری تمیز",
      sortOrder: 3,
    },
    {
      slug: "juice",
      name: "عصاره",
      image: "/jouise.jpg",
      color: "from-red-600 to-orange-600",
      subCategories: ["سبزیجات", "صیفی‌جات", "میوه"],
      description: "آب میوه و عصاره‌های طبیعی",
      sortOrder: 4,
    },
  ]
  const categories: Record<string, string> = {}
  for (const c of categoriesData) {
    const doc = await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true })
    categories[c.slug] = doc._id.toString()
  }
  console.log(`✓ ${categoriesData.length} دسته‌بندی ثبت شد`)

  // --- چند محصول نمونه با تگ مناسبتی ---
  const productsData = [
    {
      name: "سیب قرمز درجه یک",
      slug: "red-apple-premium",
      category: categories.fruit,
      lowCategories: ["همیشگی"],
      occasions: [occasions.birthday, occasions.wedding, occasions.guest],
      price: 95000,
      originalPrice: 140000,
      unit: "کیلو",
      minOrderQty: 100,
      stepQty: 25,
      images: ["/sib_red.jpg"],
      stockQuantity: 500,
      isSpecialOffer: true,
      isBestSeller: true,
      description: "دست‌چین شده از باغ‌های دماوند",
    },
    {
      name: "پرتقال تامسون",
      slug: "orange-thomson",
      category: categories.fruit,
      lowCategories: ["همیشگی"],
      occasions: [occasions["new-year"], occasions["get-well"], occasions.guest],
      price: 15000,
      originalPrice: 18000,
      unit: "کیلو",
      minOrderQty: 100,
      stepQty: 25,
      images: ["/orange.jpg"],
      stockQuantity: 800,
      isSpecialOffer: true,
      isBestSeller: true,
      description: "پرتقال آبدار و پرویتامین",
    },
    {
      name: "سبزی قورمه دست‌چین",
      slug: "ghormeh-herbs",
      category: categories.sabzi,
      lowCategories: ["خورشتی"],
      occasions: [],
      price: 85000,
      originalPrice: 95000,
      unit: "بسته",
      minOrderQty: 1,
      stepQty: 1,
      images: ["/kaho.webp"],
      stockQuantity: 200,
      isDailyDeal: true,
      description: "دست‌چین شده از تازه‌ترین سبزی‌های باطراوت",
    },
  ]
  for (const p of productsData) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true })
  }
  console.log(`✓ ${productsData.length} محصول نمونه ثبت شد`)

  // --- اکانت ادمین اولیه ---
  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin"
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeThisPassword123!"
  const existingAdmin = await Admin.findOne({ username: adminUsername })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await Admin.create({
      username: adminUsername,
      passwordHash,
      fullName: "مدیر سیستم",
      role: "superadmin",
    })
    console.log(`✓ اکانت ادمین ساخته شد → کاربری: ${adminUsername} | رمز: ${adminPassword}`)
    console.log("⚠️  حتماً بعد از اولین ورود این رمز را عوض کنید.")
  } else {
    console.log("• اکانت ادمین از قبل وجود دارد، رد شد.")
  }

  await mongoose.disconnect()
  console.log("✓ اتمام seed")
}

seed().catch((err) => {
  console.error("خطا در seed:", err)
  process.exit(1)
})
