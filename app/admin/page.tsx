"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, FolderTree, PartyPopper, ShoppingCart, Wallet, TrendingUp, BellRing } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"

interface OrderStats {
  newOrders: number
  pendingOrders: number
  unpaidOrders: number
  todayOrders: number
  todayRevenue: number
}

export default function AdminDashboardPage() {
  const [catalogStats, setCatalogStats] = useState({ products: 0, categories: 0, occasions: 0 })
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [productsRes, categoriesRes, occasionsRes, statsRes] = await Promise.all([
        fetch("/api/admin/products?pageSize=1", { credentials: "include" }).then((r) => r.json()),
        apiFetch<unknown[]>("/api/admin/categories"),
        apiFetch<unknown[]>("/api/admin/occasions"),
        apiFetch<OrderStats>("/api/admin/orders/stats"),
      ])
      setCatalogStats({
        products: productsRes?.meta?.total ?? 0,
        categories: categoriesRes.data?.length ?? 0,
        occasions: occasionsRes.data?.length ?? 0,
      })
      setOrderStats(statsRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const orderCards = [
    {
      label: "سفارش جدید (دیده‌نشده)",
      value: orderStats?.newOrders ?? 0,
      icon: BellRing,
      color: "bg-red-50 text-red-700",
      href: "/admin/orders",
      urgent: Boolean(orderStats?.newOrders),
    },
    {
      label: "در انتظار تایید",
      value: orderStats?.pendingOrders ?? 0,
      icon: ShoppingCart,
      color: "bg-amber-50 text-amber-700",
      href: "/admin/orders",
    },
    {
      label: "پرداخت‌نشده",
      value: orderStats?.unpaidOrders ?? 0,
      icon: Wallet,
      color: "bg-rose-50 text-rose-700",
      href: "/admin/orders",
    },
    {
      label: "فروش امروز",
      value: orderStats ? `${orderStats.todayRevenue.toLocaleString("fa-IR")} تومان` : "…",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
      href: "/admin/orders",
      isText: true,
    },
  ]

  const catalogCards = [
    { label: "تعداد محصولات", value: catalogStats.products, icon: Package, color: "bg-blue-50 text-blue-700", href: "/admin/products" },
    { label: "دسته‌بندی‌ها", value: catalogStats.categories, icon: FolderTree, color: "bg-amber-50 text-amber-700", href: "/admin/categories" },
    { label: "مناسبت‌های فعال", value: catalogStats.occasions, icon: PartyPopper, color: "bg-purple-50 text-purple-700", href: "/admin/occasions" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">داشبورد</h1>

      {Boolean(orderStats?.newOrders) && (
        <Link
          href="/admin/orders"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          <BellRing className="h-5 w-5 shrink-0 animate-pulse" />
          {orderStats!.newOrders} سفارش جدید هنوز بررسی نشده — برای مشاهده کلیک کنید
        </Link>
      )}

      <p className="mb-3 text-sm font-semibold text-neutral-500">وضعیت سفارش‌ها</p>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {orderCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`rounded-2xl border bg-white p-5 transition hover:shadow-sm ${card.urgent ? "border-red-300" : "border-neutral-200"}`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                {loading ? "…" : card.isText ? card.value : Number(card.value).toLocaleString("fa-IR")}
              </p>
            </Link>
          )
        })}
      </div>

      <p className="mb-3 text-sm font-semibold text-neutral-500">کاتالوگ</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalogCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href} className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-sm">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{loading ? "…" : card.value.toLocaleString("fa-IR")}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
