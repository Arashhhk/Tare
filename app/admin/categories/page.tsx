"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Plus, Pencil, Trash2, FolderTree, X } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"
import { AdminModal, FormField, inputClass } from "@/components/admin/admin-modal"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { useAdminToast } from "@/components/admin/toast-provider"
import { SafeImage } from "@/components/safe-image"
import { normalizeImagePath } from "@/lib/image-path"
import type { ICategory } from "@/types"
import { slugify } from "@/lib/slugify"

interface FormState {
  _id?: string
  slug: string
  name: string
  description: string
  image: string
  subCategories: string[]
  isActive: boolean
  sortOrder: number
}

const emptyForm: FormState = {
  slug: "",
  name: "",
  description: "",
  image: "",
  subCategories: [],
  isActive: true,
  sortOrder: 0,
}

export default function AdminCategoriesPage() {
  const { showToast } = useAdminToast()
  const [items, setItems] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [subInput, setSubInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error } = await apiFetch<ICategory[]>("/api/admin/categories")
    if (error) showToast(error, "error")
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])


  function openCreate() {
    setForm(emptyForm)
    setSubInput("")
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(cat: ICategory) {
    setForm({
      _id: cat._id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description ?? "",
      image: cat.image ?? "",
      subCategories: cat.subCategories ?? [],
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    })
    setSubInput("")
    setErrors({})
    setModalOpen(true)
  }

  function addSubCategory() {
    const value = subInput.trim()
    if (!value || form.subCategories.includes(value)) return
    setForm((f) => ({ ...f, subCategories: [...f.subCategories, value] }))
    setSubInput("")
  }

  function removeSubCategory(value: string) {
    setForm((f) => ({ ...f, subCategories: f.subCategories.filter((s) => s !== value) }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const payload = {
      slug: form.slug || slugify(form.name),
      name: form.name,
      description: form.description,
      image: form.image,
      subCategories: form.subCategories,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    }

    const isEdit = Boolean(form._id)
    const { error } = await apiFetch(
      isEdit ? `/api/admin/categories/${form._id}` : "/api/admin/categories",
      { method: isEdit ? "PUT" : "POST", body: JSON.stringify(payload) }
    )

    setSaving(false)
    if (error) {
      setErrors({ name: error })
      showToast(error, "error")
      return
    }
    showToast(isEdit ? "دسته‌بندی ویرایش شد" : "دسته‌بندی جدید ساخته شد")
    setModalOpen(false)
    load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await apiFetch(`/api/admin/categories/${deleteTarget._id}`, { method: "DELETE" })
    setDeleting(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast("دسته‌بندی حذف شد")
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">دسته‌بندی‌ها</h1>
          <p className="mt-1 text-sm text-neutral-500">دسته‌های اصلی محصولات (میوه، صیفی‌جات و ...)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <FolderTree className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">هنوز دسته‌بندی‌ای ثبت نشده.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-right text-xs text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="px-4 py-3 font-medium">زیردسته‌ها</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((cat) => (
                <tr key={cat._id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-4 py-3">
                    <SafeImage
                      src={cat.image}
                      alt={cat.name}
                      className="h-10 w-10 rounded-lg border border-neutral-200 object-cover"
                      fallbackClassName="h-10 w-10 rounded-lg border border-red-200 bg-red-50 text-red-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-800">{cat.name}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {cat.subCategories.slice(0, 3).join("، ")}
                    {cat.subCategories.length > 3 ? ` +${cat.subCategories.length - 3}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {cat.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
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

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={form._id ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}>
        <form onSubmit={handleSubmit}>
          <FormField label="نام دسته‌بندی" htmlFor="name" error={errors.name}>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              placeholder="مثلا: میوه"
            />
          </FormField>
          <FormField label="تصویر دسته‌بندی (فقط اسم فایل، بدون پسوند)" htmlFor="image">
            <p className="mb-1.5 -mt-1 text-xs text-neutral-400">
              مثال: اگه فایلت <code dir="ltr" className="rounded bg-neutral-100 px-1">public/frouit.jpg</code> هست،
              فقط بنویس <code dir="ltr" className="rounded bg-neutral-100 px-1">frouit</code>
            </p>
            <input
              id="image"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              onBlur={() => {
                const normalized = normalizeImagePath(form.image)
                if (normalized) setForm((f) => ({ ...f, image: normalized }))
              }}
              className={inputClass}
              dir="ltr"
              placeholder="frouit"
            />
            {form.image && (
              <div className="mt-2">
                <SafeImage
                  src={form.image}
                  alt="پیش‌نمایش"
                  className="h-16 w-16 rounded-lg border border-neutral-200 object-cover"
                  fallbackClassName="h-16 w-16 rounded-lg border border-red-200 bg-red-50 text-red-300"
                />
              </div>
            )}
          </FormField>
          <FormField label="توضیح کوتاه" htmlFor="description">
            <textarea
              id="description"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass}
            />
          </FormField>
          <FormField label="زیردسته‌ها" htmlFor="subInput">
            <div className="flex gap-2">
              <input
                id="subInput"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSubCategory()
                  }
                }}
                className={inputClass}
                placeholder="مثلا: تابستانی - اینتر بزن"
              />
              <button type="button" onClick={addSubCategory} className="rounded-xl bg-neutral-100 px-3 text-sm hover:bg-neutral-200">
                افزودن
              </button>
            </div>
            {form.subCategories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.subCategories.map((s) => (
                  <span key={s} className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                    {s}
                    <button type="button" onClick={() => removeSubCategory(s)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
                فعال
              </label>
            </div>
          </div>
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
        title="حذف دسته‌بندی"
        description={`آیا از حذف «${deleteTarget?.name}» مطمئن هستید؟`}
        confirmLabel="حذف"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
