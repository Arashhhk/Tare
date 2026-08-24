import type { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout-page"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "تسویه حساب | تره‌بار",
  description: "تکمیل خرید و ثبت سفارش",
}

export default function Checkout() {
  return (
    <div>
      <SiteHeader />
      <CheckoutPage />
    </div>
  )
}
