"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useAdminToast } from "@/components/admin/toast-provider"
import { SafeImage } from "@/components/safe-image"

interface AdminProductRow {
  _id: string
  name: string
  price: number
  images: string[]
  category?: { name: string }
  occasions?: { name: string }[]
  inStock: boolean
  isActive: boolean
}

export default function AdminProductsPage() {
  const { showToast } = useAdminToast()
  const [items, setItems] = useState<AdminProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: "20" })
    if (search) params.set("search", search)
    const res = await fetch(`/api/admin/products?${params.toString()}`, { credentials: "include" })
    const json = await res.json()
    if (!json.success) {
      showToast(json.error?.message ?? "خطا در دریافت محصولات", "error")
    } else {
      setItems(json.data)
      setTotalPages(json.meta?.totalPages ?? 1)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      load()
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await apiFetch(`/api/admin/products/${deleteTarget._id}`, { method: "DELETE" })
    setDeleting(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast("محصول حذف شد")
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">محصولات</h1>
          <p className="mt-1 text-sm text-neutral-500">مدیریت کامل محصولات فروشگاه</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          محصول جدید
        </Link>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام محصول..."
          className="w-full rounded-xl border border-neutral-300 bg-white py-2 pr-10 pl-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">محصولی یافت نشد.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-right text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">محصول</th>
                <th className="px-4 py-3 font-medium">دسته</th>
                <th className="px-4 py-3 font-medium">مناسبت‌ها</th>
                <th className="px-4 py-3 font-medium">قیمت</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 py-3">
                    <SafeImage
                      src={p.images?.[0]}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg border border-neutral-200 object-cover"
                      fallbackClassName="h-10 w-10 rounded-lg border border-red-200 bg-red-50 text-red-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-800">{p.name}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {p.occasions && p.occasions.length > 0 ? p.occasions.map((o) => o.name).join("، ") : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{p.price.toLocaleString("fa-IR")} تومان</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        p.isActive && p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {!p.isActive ? "غیرفعال" : p.inStock ? "موجود" : "ناموجود"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${p._id}`} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm ${p === page ? "bg-emerald-600 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف محصول"
        description={`آیا از حذف «${deleteTarget?.name}» مطمئن هستید؟`}
        confirmLabel="حذف"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
