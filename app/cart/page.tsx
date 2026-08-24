import type { Metadata } from "next"
import { CartPage } from "@/components/cart-page"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "سبد خرید | تره‌بار",
  description: "مشاهده و مدیریت سبد خرید شما",
}

export default function CartRoute() {
  return (
    <div>
      <SiteHeader />
      <CartPage />
    </div>
  )
}
