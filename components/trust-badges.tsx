"use client"

import { Shield, Truck, Headphones, CreditCard, RefreshCw, type LucideIcon } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function TrustBadges() {
  const badges: Array<{
    icon: LucideIcon
    title: string
    description: string
  }> = [
    {
      icon: Shield,
      title: "ضمانت کیفیت",
      description: " تضمین اصالت و کیفیت محصولات طبق فاکتور",
    },
    {
      icon: Truck,
      title: "ارسال سریع",
      description: "ارسال سفارش در کمتر از 6 ساعت ",
    },
    {
      icon: Headphones,
      title: "پشتیبانی 24 ساعته",
      description: "مشاوره و پشتیبانی همیشگی",
    },
    {
      icon: CreditCard,
      title: "پرداخت امن",
      description: "دارای تام گواهی نامه هایی مربوط به کسب و کار اینترنتی",
    },
    {
      icon: RefreshCw,
      title: "پیگیری پس از فروش",
      description: "پیگیری از لحظه ی صدور فاکتور تا پس از تحویل توسط مشتری",
    },
  ]

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
            چرا تره بار ؟
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            اعتماد شما، اولویت ماست
          </p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "center",
          loop: badges.length > 1,
          direction: "rtl",
          dragFree: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-mr-3 sm:-mr-4 ml-0">
          {badges.map((badge, index) => (
            <CarouselItem
              key={index}
              className="pr-3 sm:pr-4 pl-0 basis-1/2 sm:basis-[55%] md:basis-[42%] lg:basis-[30%]"
            >
              <div className="text-center p-4 sm:p-5 md:p-6 rounded-lg hover:bg-muted/50 transition-all duration-300 border border-border hover:border-orange-300 group hover:shadow-md h-full bg-card">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                  <badge.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  {badge.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {badge.description}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
