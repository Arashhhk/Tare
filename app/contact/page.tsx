import type { Metadata } from "next"
import { ContactPage } from "@/components/contact-page"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "تماس با ما | تره‌بار",
  description: "تماس با فروشگاه تره‌بار، دریافت مشاوره و پاسخ به سوالات شما",
}

export default function Contact() {
  return (
    <div>
      <SiteHeader />
      <ContactPage />
    </div>
  )
}
