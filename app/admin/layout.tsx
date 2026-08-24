"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Gift,
  PartyPopper,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Loader2,
} from "lucide-react"
import { apiFetch } from "@/lib/admin-api"
import { AdminToastProvider } from "@/components/admin/toast-provider"

const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/occasions", label: "مناسبت‌ها", icon: PartyPopper },
  { href: "/admin/gift-baskets", label: "سبدهای مناسبتی", icon: Gift },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart, badgeKey: "newOrders" as const },
]

interface AdminInfo {
  username: string
  role: string
}

interface OrderStats {
  newOrders: number
  pendingOrders: number
  unpaidOrders: number
  todayOrders: number
  todayRevenue: number
}

const POLL_INTERVAL_MS = 20_000 // هر ۲۰ ثانیه بررسی سفارش جدید — بدون نیاز به وب‌سوکت

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState<AdminInfo | null>(null)
  const [checking, setChecking] = useState(true)
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)

  const isPublicPage = pathname === "/admin/login" || pathname === "/admin/setup"

  useEffect(() => {
    if (isPublicPage) {
      setChecking(false)
      return
    }
    let active = true
    apiFetch<{ admin: AdminInfo }>("/api/admin/me").then(({ data, error }) => {
      if (!active) return
      if (error || !data) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`)
        return
      }
      setAdmin(data.admin)
      setChecking(false)
    })
    return () => {
      active = false
    }
  }, [pathname, isPublicPage, router])

  // پایش دوره‌ای سفارش‌های جدید تا ادمین بدون رفرش دستی متوجه سفارش تازه بشه
  useEffect(() => {
    if (isPublicPage || !admin) return
    let active = true
    async function pollStats() {
      const { data } = await apiFetch<OrderStats>("/api/admin/orders/stats")
      if (active && data) setOrderStats(data)
    }
    pollStats()
    const interval = setInterval(pollStats, POLL_INTERVAL_MS)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [isPublicPage, admin, pathname])

  async function handleLogout() {
    await apiFetch("/api/admin/login", { method: "DELETE" })
    router.replace("/admin/login")
  }

  if (isPublicPage) return <AdminToastProvider>{children}</AdminToastProvider>

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-neutral-50" dir="rtl">
        {/* Topbar موبایل */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="باز کردن منو"
            className="relative rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
          >
            <Menu className="h-5 w-5" />
            {Boolean(orderStats?.newOrders) && (
              <span className="absolute -left-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {orderStats!.newOrders > 9 ? "9+" : orderStats!.newOrders}
              </span>
            )}
          </button>
          <span className="font-bold text-neutral-900">پنل مدیریت</span>
          <div className="w-9" />
        </header>

        <div className="flex">
          {/* سایدبار موبایل (Overlay) */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold">منو</span>
                  <button onClick={() => setSidebarOpen(false)} aria-label="بستن منو" className="rounded-lg p-1.5 hover:bg-neutral-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SidebarNav pathname={pathname} orderStats={orderStats} onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          )}

          {/* سایدبار دسکتاپ */}
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-l border-neutral-200 bg-white p-4 lg:block">
            <div className="mb-6 flex items-center gap-2 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">
                ت
              </div>
              <span className="font-bold text-neutral-900">پنل مدیریت تره‌بار</span>
            </div>
            <SidebarNav pathname={pathname} orderStats={orderStats} />
          </aside>

          <main className="min-w-0 flex-1 p-4 lg:p-8">
            {admin && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-500">
                  خوش آمدید، <span className="font-medium text-neutral-800">{admin.username}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition hover:bg-neutral-100"
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </button>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </AdminToastProvider>
  )
}

function SidebarNav({
  pathname,
  orderStats,
  onNavigate,
}: {
  pathname: string
  orderStats: OrderStats | null
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        const badgeCount = item.badgeKey && orderStats ? orderStats[item.badgeKey] : 0
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-emerald-50 text-emerald-700" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="h-4 w-4" />
              {item.label}
            </span>
            {Boolean(badgeCount) && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {badgeCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
