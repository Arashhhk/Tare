"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Plus, Pencil, Trash2, PartyPopper } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"
import { AdminModal, FormField, inputClass } from "@/components/admin/admin-modal"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useAdminToast } from "@/components/admin/toast-provider"
import type { IOccasion } from "@/types"
import { slugify } from "@/lib/slugify"

const COLOR_PRESETS = [
  { label: "صورتی (تولد)", value: "from-pink-500 to-rose-600" },
  { label: "بنفش (عروسی)", value: "from-purple-500 to-fuchsia-600" },
  { label: "خاکستری (ختم)", value: "from-neutral-500 to-neutral-700" },
  { label: "سبز (نوروز)", value: "from-emerald-500 to-green-600" },
  { label: "نارنجی (مهمانی)", value: "from-amber-500 to-orange-600" },
  { label: "آبی (عیادت)", value: "from-sky-500 to-blue-600" },
]

interface FormState {
  _id?: string
  slug: string
  name: string
  description: string
  color: string
  isActive: boolean
  sortOrder: number
}

const emptyForm: FormState = { slug: "", name: "", description: "", color: COLOR_PRESETS[0].value, isActive: true, sortOrder: 0 }

export default function AdminOccasionsPage() {
  const { showToast } = useAdminToast()
  const [items, setItems] = useState<IOccasion[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<IOccasion | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error } = await apiFetch<IOccasion[]>("/api/admin/occasions")
    if (error) showToast(error, "error")
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(occasion: IOccasion) {
    setForm({
      _id: occasion._id,
      slug: occasion.slug,
      name: occasion.name,
      description: occasion.description ?? "",
      color: occasion.color ?? COLOR_PRESETS[0].value,
      isActive: occasion.isActive,
      sortOrder: occasion.sortOrder,
    })
    setErrors({})
    setModalOpen(true)
  }


  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const payload = {
      slug: form.slug || slugify(form.name),
      name: form.name,
      description: form.description,
      color: form.color,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    }

    const isEdit = Boolean(form._id)
    const { error, status, data } = await apiFetch(
      isEdit ? `/api/admin/occasions/${form._id}` : "/api/admin/occasions",
      { method: isEdit ? "PUT" : "POST", body: JSON.stringify(payload) }
    )

    setSaving(false)

    if (error) {
      if (status === 400) setErrors({ name: error })
      showToast(error, "error")
      return
    }

    showToast(isEdit ? "مناسبت ویرایش شد" : "مناسبت جدید ساخته شد")
    setModalOpen(false)
    load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await apiFetch(`/api/admin/occasions/${deleteTarget._id}`, { method: "DELETE" })
    setDeleting(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast("مناسبت حذف شد")
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">مناسبت‌ها</h1>
          <p className="mt-1 text-sm text-neutral-500">
            دسته‌بندی مناسبتی محصولات — تولد، عروسی، ختم و... را اینجا مدیریت کنید
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          مناسبت جدید
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <PartyPopper className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">هنوز مناسبتی ثبت نشده. اولین مناسبت را اضافه کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((occ) => (
            <div key={occ._id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className={`inline-flex rounded-lg bg-gradient-to-l px-3 py-1 text-xs font-semibold text-white ${occ.color}`}>
                  {occ.name}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    occ.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {occ.isActive ? "فعال" : "غیرفعال"}
                </span>
              </div>
              {occ.description && <p className="mb-3 text-sm text-neutral-600 line-clamp-2">{occ.description}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(occ)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </button>
                <button
                  onClick={() => setDeleteTarget(occ)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={form._id ? "ویرایش مناسبت" : "مناسبت جدید"}>
        <form onSubmit={handleSubmit}>
          <FormField label="نام مناسبت" htmlFor="name" error={errors.name}>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              placeholder="مثلا: تولد"
            />
          </FormField>
          <FormField label="توضیح کوتاه (اختیاری)" htmlFor="description">
            <textarea
              id="description"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass}
            />
          </FormField>
          <FormField label="رنگ نمایش" htmlFor="color">
            <select
              id="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className={inputClass}
            >
              {COLOR_PRESETS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </FormField>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <FormField label="ترتیب نمایش" htmlFor="sortOrder">
              <input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className={inputClass}
              />
            </FormField>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-300 text-emerald-600"
                />
                فعال و قابل نمایش
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="حذف مناسبت"
        description={`آیا از حذف «${deleteTarget?.name}» مطمئن هستید؟ اگر محصولی از این مناسبت استفاده کند، امکان حذف نیست.`}
        confirmLabel="حذف"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
