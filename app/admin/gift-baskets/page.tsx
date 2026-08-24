"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Plus, Pencil, Trash2, Gift } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"
import { AdminModal, FormField, inputClass } from "@/components/admin/admin-modal"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useAdminToast } from "@/components/admin/toast-provider"
import type { IOccasion } from "@/types"
import { slugify } from "@/lib/slugify"

interface BasketRow {
  _id: string
  name: string
  slug: string
  price: number
  isActive: boolean
  occasion?: { _id: string; name: string }
  items: { product: { _id: string; name: string }; quantity: number }[]
}

interface AdminProductOption {
  _id: string
  name: string
}

interface ItemDraft {
  product: string
  quantity: number
}

interface FormState {
  _id?: string
  name: string
  slug: string
  occasion: string
  description: string
  image: string
  price: number
  items: ItemDraft[]
  isActive: boolean
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  occasion: "",
  description: "",
  image: "",
  price: 0,
  items: [],
  isActive: true,
}

export default function AdminGiftBasketsPage() {
  const { showToast } = useAdminToast()
  const [items, setItems] = useState<BasketRow[]>([])
  const [occasions, setOccasions] = useState<IOccasion[]>([])
  const [products, setProducts] = useState<AdminProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BasketRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const [basketsRes, occRes, prodRes] = await Promise.all([
      apiFetch<BasketRow[]>("/api/admin/gift-baskets"),
      apiFetch<IOccasion[]>("/api/admin/occasions"),
      fetch("/api/admin/products?pageSize=100", { credentials: "include" }).then((r) => r.json()),
    ])
    if (basketsRes.error) showToast(basketsRes.error, "error")
    setItems(basketsRes.data ?? [])
    setOccasions(occRes.data ?? [])
    setProducts(prodRes?.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])


  function openCreate() {
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(basket: BasketRow) {
    setForm({
      _id: basket._id,
      name: basket.name,
      slug: basket.slug,
      occasion: basket.occasion?._id ?? "",
      description: "",
      image: "",
      price: basket.price,
      items: basket.items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
      isActive: basket.isActive,
    })
    setModalOpen(true)
  }

  function addItem() {
    if (products.length === 0) return
    setForm((f) => ({ ...f, items: [...f.items, { product: products[0]._id, quantity: 1 }] }))
  }

  function updateItem(idx: number, patch: Partial<ItemDraft>) {
    setForm((f) => ({ ...f, items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) }))
  }

  function removeItem(idx: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (form.items.length === 0) {
      showToast("حداقل یک محصول به سبد اضافه کنید", "error")
      return
    }
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      occasion: form.occasion,
      description: form.description,
      image: form.image,
      price: Number(form.price),
      items: form.items,
      isActive: form.isActive,
    }

    const isEdit = Boolean(form._id)
    const { error } = await apiFetch(
      isEdit ? `/api/admin/gift-baskets/${form._id}` : "/api/admin/gift-baskets",
      { method: isEdit ? "PUT" : "POST", body: JSON.stringify(payload) }
    )

    setSaving(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast(isEdit ? "سبد ویرایش شد" : "سبد جدید ساخته شد")
    setModalOpen(false)
    load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await apiFetch(`/api/admin/gift-baskets/${deleteTarget._id}`, { method: "DELETE" })
    setDeleting(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast("سبد حذف شد")
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">سبدهای مناسبتی</h1>
          <p className="mt-1 text-sm text-neutral-500">پکیج‌های آماده برای هر مناسبت (مثلا سبد میوه عروسی)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          سبد جدید
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <Gift className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">هنوز سبدی ثبت نشده.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div key={b._id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-neutral-800">{b.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${b.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                  {b.isActive ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <p className="mb-2 text-xs text-neutral-400">مناسبت: {b.occasion?.name ?? "—"}</p>
              <p className="mb-3 text-sm text-neutral-600">{b.items.length} قلم کالا</p>
              <p className="mb-3 font-semibold text-emerald-700">{b.price.toLocaleString("fa-IR")} تومان</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </button>
                <button onClick={() => setDeleteTarget(b)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={form._id ? "ویرایش سبد" : "سبد جدید"} widthClass="max-w-xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <FormField label="نام سبد" htmlFor="name">
              <input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="سبد میوه عروسی لوکس" />
            </FormField>
            <FormField label="مناسبت" htmlFor="occasion">
              <select id="occasion" required value={form.occasion} onChange={(e) => setForm((f) => ({ ...f, occasion: e.target.value }))} className={inputClass}>
                <option value="">انتخاب کنید</option>
                {occasions.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="قیمت نهایی سبد (تومان)" htmlFor="price">
            <input id="price" type="number" min={0} required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className={inputClass} />
          </FormField>
          <FormField label="توضیح کوتاه" htmlFor="description">
            <textarea id="description" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
          </FormField>

          <FormField label="اقلام سبد" htmlFor="items">
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <select
                    value={item.product}
                    onChange={(e) => updateItem(idx, { product: e.target.value })}
                    className={`${inputClass} flex-1`}
                  >
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                    className={`${inputClass} w-20`}
                  />
                  <button type="button" onClick={() => removeItem(idx)} className="rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50">
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addItem} className="rounded-xl bg-neutral-100 px-3 py-2 text-xs hover:bg-neutral-200" disabled={products.length === 0}>
                + افزودن محصول به سبد
              </button>
            </div>
          </FormField>

          <label className="mb-4 flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 rounded border-neutral-300 text-emerald-600" />
            فعال و قابل نمایش
          </label>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              انصراف
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
              {saving ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف سبد مناسبتی"
        description={`آیا از حذف «${deleteTarget?.name}» مطمئن هستید؟`}
        confirmLabel="حذف"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
