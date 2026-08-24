import type React from "react"
import type { Metadata, Viewport } from "next"
import { Vazirmatn } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"

// Vazirmatn یک فونت استاندارد و حرفه‌ای فارسی/عربی+لاتین است (بر خلاف Inter که اصلاً حروف
// فارسی ندارد و باعث می‌شد متن فارسی با فونت پیش‌فرض ناهماهنگ هر سیستم نمایش داده شود).
const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazirmatn" })

export const metadata: Metadata = {
  metadataBase: new URL("https://YOUR-DOMAIN.vercel.app"),

  title: "تره‌بار | خرید آنلاین میوه و سبزیجات تازه",

  description:
    "خرید آنلاین میوه، صیفی‌جات و سبزیجات تازه با قیمت تره‌بار مرکزی، همراه با سبدهای مناسبتی ویژه تولد، عروسی، ختم و مهمانی. ارسال سریع و تضمین کیفیت.",

  keywords:
    "خرید میوه آنلاین, سبزیجات تازه, صیفی‌جات, سبد میوه مناسبتی, سبد میوه تولد, سبد میوه عروسی, تره‌بار آنلاین",

  authors: [{ name: "تره‌بار" }],

  openGraph: {
    title: "تره‌بار | خرید آنلاین میوه و سبزیجات تازه",
    description:
      "خرید آنلاین میوه و صیفی‌جات با قیمت تره‌بار مرکزی و سبدهای مناسبتی آماده",
    type: "website",
    locale: "fa_IR",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans`}>
        <CartProvider>
          <main className="min-h-screen w-full overflow-x-hidden">{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
