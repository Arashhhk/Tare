"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"

export function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-neutral-300" />
          <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">سبد خرید شما خالی است</h1>
          <p className="text-neutral-600">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button size="lg">مشاهده محصولات</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold text-neutral-800 sm:text-3xl">سبد خرید شما</h1>

      <div className="grid items-start gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row md:gap-6">
                  <SafeImage
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-24 w-24 rounded-md border object-cover sm:h-28 sm:w-28"
                    fallbackClassName="h-24 w-24 rounded-md border sm:h-28 sm:w-28"
                  />

                  <div className="flex-1 space-y-1 text-center sm:text-right">
                    <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">{item.name}</h3>
                    <p className="text-sm font-medium text-neutral-600">
                      {item.price.toLocaleString("fa-IR")} تومان / {item.unit}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, Math.max(item.minQty, item.quantity - item.step))}
                        className="h-8 w-8"
                        aria-label="کاهش تعداد"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-14 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + item.step)}
                        className="h-8 w-8"
                        aria-label="افزایش تعداد"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" /> حذف
                    </Button>
                  </div>

                  <div className="flex-shrink-0 text-center sm:w-24 sm:text-right">
                    <p className="text-base font-semibold text-neutral-800 sm:text-lg">
                      {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="sticky top-24 lg:col-span-1">
          <Card className="shadow-md">
            <CardContent className="space-y-4 p-6">
              <h3 className="mb-4 text-xl font-bold text-neutral-800">خلاصه سفارش</h3>

              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>جمع محصولات ({items.reduce((acc, item) => acc + item.quantity, 0)} کالا):</span>
                  <span>{total.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span>هزینه ارسال:</span>
                  <span className="font-medium text-green-600">رایگان</span>
                </div>
                <div className="my-2 border-t border-neutral-200"></div>
                <div className="flex justify-between pt-2 text-lg font-bold text-neutral-800">
                  <span>مبلغ قابل پرداخت:</span>
                  <span>{total.toLocaleString("fa-IR")} تومان</span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700" size="lg">
                  ادامه و پرداخت
                </Button>
              </Link>

              <Button variant="outline" className="w-full border-neutral-300 hover:bg-neutral-50" onClick={clearCart}>
                پاک کردن سبد خرید
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
