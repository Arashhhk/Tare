import type { Metadata } from "next"
import { AboutPage } from "@/components/about-page"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "درباره ما | تره‌بار",
  description: "آشنایی با فروشگاه تره‌بار و ارزش‌هایی که به آن پایبندیم",
}

export default function About() {
  return (
    <div className="wfull">
      <SiteHeader />
      <AboutPage />
    </div>
  )
}
