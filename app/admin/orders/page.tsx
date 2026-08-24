"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Search, Phone, Copy, Printer, CircleDot } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"
import { AdminModal } from "@/components/admin/admin-modal"
import { useAdminToast } from "@/components/admin/toast-provider"

interface OrderRow {
  _id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  totalAmount: number
  status: string
  paymentStatus: "unpaid" | "paid"
  paymentMethod: "cod" | "online"
  notes?: string
  items: { name: string; price: number; quantity: number; unit: string }[]
  createdAt: string
  viewedAt?: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "در انتظار تایید", color: "bg-amber-50 text-amber-700" },
  confirmed: { label: "تایید شده", color: "bg-blue-50 text-blue-700" },
  processing: { label: "در حال آماده‌سازی", color: "bg-purple-50 text-purple-700" },
  shipped: { label: "ارسال شده", color: "bg-cyan-50 text-cyan-700" },
  delivered: { label: "تحویل داده شده", color: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "لغو شده", color: "bg-red-50 text-red-700" },
}

export default function AdminOrdersPage() {
  const { showToast } = useAdminToast()
  const [items, setItems] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<OrderRow | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams({ pageSize: "50" })
    if (status) params.set("status", status)
    if (search) params.set("search", search)
    const res = await fetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" })
    const json = await res.json()
    if (json.success) setItems(json.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    const t = setTimeout(load, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function openOrder(row: OrderRow) {
    setDetailLoading(true)
    setSelected(row)
    // این فراخوانی سفارش را به‌عنوان «دیده‌شده» هم علامت می‌زند (سمت سرور)
    const { data, error } = await apiFetch<OrderRow>(`/api/admin/orders/${row._id}`)
    setDetailLoading(false)
    if (error || !data) {
      showToast(error ?? "خطا در دریافت سفارش", "error")
      return
    }
    setSelected(data)
    // بج تعداد سفارش‌های جدید را بدون نیاز به رفرش کامل به‌روز نگه می‌داریم
    setItems((prev) => prev.map((it) => (it._id === row._id ? { ...it, viewedAt: data.viewedAt } : it)))
  }

  async function updateStatus(newStatus: string) {
    if (!selected) return
    setUpdating(true)
    const { error, data } = await apiFetch<OrderRow>(`/api/admin/orders/${selected._id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    })
    setUpdating(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast("وضعیت سفارش به‌روزرسانی شد")
    setSelected(data)
    load()
  }

  async function togglePayment() {
    if (!selected) return
    setUpdating(true)
    const nextStatus = selected.paymentStatus === "paid" ? "unpaid" : "paid"
    const { error, data } = await apiFetch<OrderRow>(`/api/admin/orders/${selected._id}`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus: nextStatus }),
    })
    setUpdating(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast(nextStatus === "paid" ? "سفارش پرداخت‌شده علامت خورد" : "سفارش به پرداخت‌نشده برگشت")
    setSelected(data)
    load()
  }

  function copyAddress() {
    if (!selected) return
    navigator.clipboard.writeText(`${selected.customerName} - ${selected.customerPhone}\n${selected.customerAddress}`)
    showToast("آدرس کپی شد")
  }

  function printOrder() {
    window.print()
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">سفارش‌ها</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="شماره سفارش، نام یا تلفن..."
            className="w-full rounded-xl border border-neutral-300 bg-white py-2 pr-10 pl-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
        >
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(STATUS_LABELS).map(([key, v]) => (
            <option key={key} value={key}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <ShoppingCart className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">سفارشی یافت نشد.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-right text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">شماره سفارش</th>
                <th className="px-4 py-3 font-medium">مشتری</th>
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">پرداخت</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => {
                const isNew = !o.viewedAt
                return (
                  <tr
                    key={o._id}
                    onClick={() => openOrder(o)}
                    className={`cursor-pointer border-b border-neutral-50 last:border-0 hover:bg-neutral-50 ${isNew ? "bg-red-50/40" : ""}`}
                  >
                    <td className="px-2 py-3">
                      {isNew && <CircleDot className="h-3.5 w-3.5 text-red-500" aria-label="سفارش جدید" />}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-800" dir="ltr">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {o.customerName} <span className="text-neutral-400" dir="ltr">({o.customerPhone})</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{o.totalAmount.toLocaleString("fa-IR")} تومان</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${o.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                        {o.paymentStatus === "paid" ? "پرداخت‌شده" : "پرداخت‌نشده"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_LABELS[o.status]?.color}`}>
                        {STATUS_LABELS[o.status]?.label ?? o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {new Date(o.createdAt).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={Boolean(selected)} onClose={() => setSelected(null)} title={`سفارش ${selected?.orderNumber ?? ""}`} widthClass="max-w-lg">
        {selected && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <a
                href={`tel:${selected.customerPhone}`}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Phone className="h-3.5 w-3.5" />
                تماس با مشتری
              </a>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Copy className="h-3.5 w-3.5" />
                کپی آدرس
              </button>
              <button
                onClick={printOrder}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Printer className="h-3.5 w-3.5" />
                چاپ فاکتور
              </button>
            </div>

            <div className="mb-4 space-y-1 text-sm text-neutral-600">
              <p>
                <span className="text-neutral-400">مشتری: </span>
                {selected.customerName}
              </p>
              <p dir="ltr" className="text-right">
                <span className="text-neutral-400">تلفن: </span>
                {selected.customerPhone}
              </p>
              <p>
                <span className="text-neutral-400">آدرس: </span>
                {selected.customerAddress}
              </p>
              {selected.notes && (
                <p>
                  <span className="text-neutral-400">توضیحات: </span>
                  {selected.notes}
                </p>
              )}
            </div>

            <div className="mb-4 rounded-xl border border-neutral-100">
              {selected.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-neutral-50 px-3 py-2 text-sm last:border-0">
                  <span>{it.name}</span>
                  <span className="text-neutral-500">
                    {it.quantity} {it.unit} × {it.price.toLocaleString("fa-IR")}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2 text-sm font-bold">
                <span>جمع کل</span>
                <span>{selected.totalAmount.toLocaleString("fa-IR")} تومان</span>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl border border-neutral-100 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-neutral-800">وضعیت پرداخت</p>
                <p className="text-xs text-neutral-400">
                  {selected.paymentMethod === "cod" ? "پرداخت در محل" : "پرداخت آنلاین"}
                </p>
              </div>
              <button
                onClick={togglePayment}
                disabled={updating || detailLoading}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                  selected.paymentStatus === "paid" ? "bg-emerald-600 text-white" : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {selected.paymentStatus === "paid" ? "✓ پرداخت‌شده" : "علامت به‌عنوان پرداخت‌شده"}
              </button>
            </div>

            <label className="mb-1.5 block text-sm font-medium text-neutral-700">تغییر وضعیت سفارش</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_LABELS).map(([key, v]) => (
                <button
                  key={key}
                  disabled={updating || detailLoading || selected.status === key}
                  onClick={() => updateStatus(key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                    selected.status === key ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
