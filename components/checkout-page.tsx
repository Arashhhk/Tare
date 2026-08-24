"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import { MapPin, Truck, Loader2, CheckCircle2 } from "lucide-react"

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      customerName: `${firstName} ${lastName}`.trim(),
      customerPhone: phone,
      customerAddress: address,
      notes: notes || undefined,
      items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.error?.message ?? "خطا در ثبت سفارش. دوباره تلاش کنید.")
        setSubmitting(false)
        return
      }

      setOrderNumber(json.data.orderNumber)
      clearCart()
    } catch {
      setError("خطا در برقراری ارتباط با سرور. اتصال اینترنت را بررسی کنید.")
    } finally {
      setSubmitting(false)
    }
  }

  if (orderNumber) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-600" />
        <h1 className="mb-2 text-2xl font-bold text-neutral-800 sm:text-3xl">سفارش شما با موفقیت ثبت شد</h1>
        <p className="mb-1 text-neutral-600">کد پیگیری سفارش شما:</p>
        <p className="mb-6 text-xl font-bold text-emerald-700" dir="ltr">{orderNumber}</p>
        <Button size="lg" onClick={() => router.push("/products")}>
          بازگشت به فروشگاه
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-neutral-600">سبد خرید شما خالی است.</p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          مشاهده محصولات
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-neutral-800 sm:text-3xl">تسویه حساب</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  اطلاعات ارسال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">نام</Label>
                    <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">شماره تماس (مثال: 09121234567)</Label>
                  <Input id="phone" type="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="address">آدرس کامل</Label>
                  <Textarea id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="notes">توضیحات سفارش (اختیاری)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثلا: ساعت مناسب تحویل" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  نحوه پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <Truck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">پرداخت در محل</p>
                    <p className="text-sm text-neutral-600">هزینه سفارش هنگام تحویل دریافت می‌شود</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>جمع کل:</span>
                    <span>{total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>هزینه ارسال:</span>
                    <span className="text-green-600">رایگان</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>مبلغ نهایی:</span>
                    <span>{total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                  {submitting ? "در حال ثبت سفارش..." : "تکمیل خرید"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
