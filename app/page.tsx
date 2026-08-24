import { HeroSection } from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { OccasionsSection } from "@/components/occasions-section"
import { HowItWorks } from "@/components/how-it-works"
import { SpecialOffers } from "@/components/special-offers"
import { TrustBadges } from "@/components/trust-badges"
import { BestsellingProducts } from "@/components/bestselling-products"
import { DailyDeals } from "@/components/daily-deals"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteHeader } from "@/components/site-header"
import { getActiveCategories, getActiveOccasions, getHomepageProducts } from "@/lib/server-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tarebar.ir"

// این صفحه عمداً کاملاً داینامیک است (نه ISR) تا با استراتژی رندر بقیه صفحات (که همگی
// به‌صورت per-request از دیتابیس می‌خوانند) هماهنگ بماند. ترکیب یک صفحه‌ی ISR/استاتیک با
// صفحات کاملاً داینامیک در کنار هم، باعث رفتار ناپایدار Router Cache نکست‌جی‌اس هنگام
// ناوبری سمت کلاینت بین آن‌ها می‌شود (نمایش نسخه‌ی قدیمی/بی‌استایل تا رفرش دستی).
export const dynamic = "force-dynamic"

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "تره‌بار",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: "فروشگاه آنلاین میوه، صیفی‌جات و سبد مناسبتی با ارسال سریع",
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "تره‌بار",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default async function HomePage() {
  const [categories, occasions, { bestSellers, specialOffers, dailyDeals }] = await Promise.all([
    getActiveCategories(),
    getActiveOccasions(),
    getHomepageProducts(),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <div className="space-y-16">
        <SiteHeader />
        <div className="container">
          <HeroSection />
          <CategoryGrid categories={categories} />
          <OccasionsSection occasions={occasions} />
          <HowItWorks />
          <BestsellingProducts products={bestSellers} />
          <SpecialOffers products={specialOffers} />
          <DailyDeals products={dailyDeals} />
          <TrustBadges />
          <NewsletterSection />
        </div>
      </div>
    </>
  )
}
