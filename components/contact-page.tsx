"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Instagram } from "lucide-react"

// اطلاعات تماس نمونه برای این پروژه نمایشی — قبل از راه‌اندازی واقعی با اطلاعات کسب‌وکار خود جایگزین کنید
const contactInfo = [
  { icon: Phone, title: "تماس تلفنی", details: ["021-91300512"], description: "پاسخگویی شنبه تا پنج‌شنبه، ۸ تا ۲۰", color: "from-blue-500 to-cyan-500" },
  { icon: Mail, title: "ایمیل", details: ["info@tarebar.ir"], description: "پاسخ در سریع‌ترین زمان", color: "from-green-500 to-emerald-500" },
  { icon: MapPin, title: "آدرس", details: ["تهران، خیابان ولیعصر، نرسیده به میدان ونک"], description: "بازدید حضوری", color: "from-purple-500 to-pink-500" },
  { icon: Clock, title: "ساعات کاری", details: ["هر روز، ۸ صبح تا ۲۲"], description: "پشتیبانی آنلاین", color: "from-orange-500 to-red-500" },
]

export function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: "", phone: "", subject: "", message: "" })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // TODO: به یک API route واقعی (مثلا /api/contact) وصل شود که پیام را ایمیل/ذخیره کند
    await new Promise((r) => setTimeout(r, 500))
    setSubmitting(false)
    toast({ title: "پیام شما ارسال شد", description: "در اسرع وقت با شما تماس خواهیم گرفت" })
    setFormData({ name: "", phone: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen container">
      <section className="relative max-w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-neutral-900 text-white mt-10 py-16 sm:py-20 rounded-2xl">
        <div className="absolute inset-0 industrial-pattern opacity-10"></div>
        <div className="mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-emerald-500">تماس با ما</Badge>
            <h1 className="text-3xl sm:text-5xl font-bold mb-6">در خدمت شما هستیم</h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
              تیم ما آماده پاسخگویی به سوالات شما درباره محصولات، سفارش‌ها و سبدهای مناسبتی است
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <info.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-neutral-800 mb-2 sm:mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-2 sm:mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm sm:text-base text-neutral-600 font-medium" dir="ltr">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-neutral-50">
        <div className="mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                  ارسال پیام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">نام و نام خانوادگی *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">شماره تماس *</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">موضوع *</Label>
                    <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="message">پیام شما *</Label>
                    <Textarea id="message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="mt-1" />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    <Send className="w-4 h-4 ml-2" />
                    {submitting ? "در حال ارسال..." : "ارسال پیام"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-0">
                  <div className="h-56 sm:h-64 bg-neutral-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-neutral-600">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>نقشه فروشگاه</p>
                      <p className="text-sm">تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۵</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-neutral-800 mb-2">فروشگاه تره‌بار</h3>
                    <p className="text-neutral-600">
                      برای بازدید حضوری، به آدرس فوق مراجعه فرمایید.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>شبکه‌های اجتماعی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Instagram className="w-4 h-4 ml-2" />
                      اینستاگرام
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
