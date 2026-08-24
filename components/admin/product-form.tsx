"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/admin-api"
import { useAdminToast } from "@/components/admin/toast-provider"
import { FormField, inputClass } from "@/components/admin/admin-modal"
import { SafeImage } from "@/components/safe-image"
import { normalizeImagePath } from "@/lib/image-path"
import type { ICategory, IOccasion } from "@/types"
import { slugify } from "@/lib/slugify"

interface ProductFormValues {
  name: string
  slug: string
  category: string
  lowCategories: string[]
  occasions: string[]
  price: number
  originalPrice: number
  unit: string
  minOrderQty: number
  stepQty: number
  images: string[]
  stockQuantity: number
  inStock: boolean
  isSpecialOffer: boolean
  isBestSeller: boolean
  isDailyDeal: boolean
  description: string
  isActive: boolean
}

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  category: "",
  lowCategories: [],
  occasions: [],
  price: 0,
  originalPrice: 0,
  unit: "کیلو",
  minOrderQty: 100,
  stepQty: 1,
  images: [],
  stockQuantity: 0,
  inStock: true,
  isSpecialOffer: false,
  isBestSeller: false,
  isDailyDeal: false,
  description: "",
  isActive: true,
}

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const { showToast } = useAdminToast()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [occasions, setOccasions] = useState<IOccasion[]>([])
  const [values, setValues] = useState<ProductFormValues>(emptyValues)
  const [imageInput, setImageInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(Boolean(productId))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadRefs() {
      const [catRes, occRes] = await Promise.all([
        apiFetch<ICategory[]>("/api/admin/categories"),
        apiFetch<IOccasion[]>("/api/admin/occasions"),
      ])
      setCategories(catRes.data ?? [])
      setOccasions(occRes.data ?? [])
    }
    loadRefs()
  }, [])

  useEffect(() => {
    if (!productId) return
    async function loadProduct() {
      const { data, error } = await apiFetch<any>(`/api/admin/products/${productId}`)
      if (error || !data) {
        showToast(error ?? "محصول یافت نشد", "error")
        router.push("/admin/products")
        return
      }
      setValues({
        name: data.name,
        slug: data.slug,
        category: typeof data.category === "object" ? data.category._id : data.category,
        lowCategories: data.lowCategories ?? [],
        occasions: (data.occasions ?? []).map((o: any) => (typeof o === "object" ? o._id : o)),
        price: data.price,
        originalPrice: data.originalPrice ?? 0,
        unit: data.unit ?? "کیلو",
        minOrderQty: data.minOrderQty ?? 100,
        stepQty: data.stepQty ?? 1,
        images: data.images ?? [],
        stockQuantity: data.stockQuantity ?? 0,
        inStock: data.inStock,
        isSpecialOffer: data.isSpecialOffer,
        isBestSeller: data.isBestSeller,
        isDailyDeal: data.isDailyDeal ?? false,
        description: data.description ?? "",
        isActive: data.isActive,
      })
      setLoading(false)
    }
    loadProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])


  function toggleOccasion(id: string) {
    setValues((v) => ({
      ...v,
      occasions: v.occasions.includes(id) ? v.occasions.filter((o) => o !== id) : [...v.occasions, id],
    }))
  }

  function toggleLowCategory(sub: string) {
    setValues((v) => ({
      ...v,
      lowCategories: v.lowCategories.includes(sub) ? v.lowCategories.filter((s) => s !== sub) : [...v.lowCategories, sub],
    }))
  }

  const availableSubCategories = categories.find((c) => c._id === values.category)?.subCategories ?? []

  function addImage() {
    // ادمین فقط اسم فایل رو وارد می‌کنه (بدون پسوند، بدون / و بدون کلمه‌ی public)
    // پسوند jpg خودکار اضافه می‌شه چون فایل واقعی از پوشه‌ی public/ پروژه سرو می‌شه.
    const path = normalizeImagePath(imageInput)
    if (!path) return
    if (values.images.includes(path)) {
      setImageInput("")
      return
    }
    setValues((v) => ({ ...v, images: [...v.images, path] }))
    setImageInput("")
  }

  function removeImage(idx: number) {
    setValues((v) => ({ ...v, images: v.images.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const payload = {
      ...values,
      slug: values.slug || slugify(values.name),
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
      minOrderQty: Number(values.minOrderQty),
      stepQty: Number(values.stepQty),
      stockQuantity: Number(values.stockQuantity),
    }

    const isEdit = Boolean(productId)
    const { error, data } = await apiFetch(
      isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
      { method: isEdit ? "PUT" : "POST", body: JSON.stringify(payload) }
    )

    setSaving(false)
    if (error) {
      showToast(error, "error")
      return
    }
    showToast(isEdit ? "محصول ویرایش شد" : "محصول جدید ساخته شد")
    router.push("/admin/products")
  }

  if (loading) return <p className="text-sm text-neutral-500">در حال بارگذاری...</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormField label="نام محصول" htmlFor="name">
            <input
              id="name"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <FormField label="دسته‌بندی" htmlFor="category">
            <select
              id="category"
              required
              value={values.category}
              onChange={(e) => {
                const newCategoryId = e.target.value
                const newSubs = categories.find((c) => c._id === newCategoryId)?.subCategories ?? []
                setValues((v) => ({
                  ...v,
                  category: newCategoryId,
                  // زیردسته‌هایی که به دسته‌بندی جدید تعلق ندارند حذف می‌شوند
                  lowCategories: v.lowCategories.filter((s) => newSubs.includes(s)),
                }))
              }}
              className={inputClass}
            >
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="زیردسته (چند انتخابی، بر اساس دسته‌بندی انتخاب‌شده)" htmlFor="lowCategories">
            {availableSubCategories.length === 0 ? (
              <p className="text-xs text-neutral-400">
                {values.category
                  ? "این دسته‌بندی هنوز زیردسته‌ای ندارد. از پنل ادمین → دسته‌بندی‌ها اضافه کنید."
                  : "ابتدا یک دسته‌بندی انتخاب کنید."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSubCategories.map((sub) => {
                  const active = values.lowCategories.includes(sub)
                  return (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => toggleLowCategory(sub)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active ? "border-amber-600 bg-amber-50 text-amber-700" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {sub}
                    </button>
                  )
                })}
              </div>
            )}
          </FormField>
        </div>

        <FormField label="مناسبت‌ها (چند انتخابی)" htmlFor="occasions">
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => {
              const active = values.occasions.includes(o._id)
              return (
                <button
                  type="button"
                  key={o._id}
                  onClick={() => toggleOccasion(o._id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {o.name}
                </button>
              )
            })}
            {occasions.length === 0 && <p className="text-xs text-neutral-400">ابتدا از بخش «مناسبت‌ها» چند مناسبت بسازید.</p>}
          </div>
        </FormField>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <FormField label="قیمت (تومان)" htmlFor="price">
            <input
              id="price"
              type="number"
              required
              min={0}
              value={values.price}
              onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) }))}
              className={inputClass}
            />
          </FormField>
          <FormField label="قیمت قبل از تخفیف" htmlFor="originalPrice">
            <input
              id="originalPrice"
              type="number"
              min={0}
              value={values.originalPrice}
              onChange={(e) => setValues((v) => ({ ...v, originalPrice: Number(e.target.value) }))}
              className={inputClass}
            />
          </FormField>
          <FormField label="واحد" htmlFor="unit">
            <select
              id="unit"
              value={values.unit}
              onChange={(e) => setValues((v) => ({ ...v, unit: e.target.value }))}
              className={inputClass}
            >
              {["کیلو", "عدد", "بسته", "کارتن", "گرم"].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <FormField label="حداقل سفارش" htmlFor="minOrderQty">
            <input
              id="minOrderQty"
              type="number"
              min={1}
              value={values.minOrderQty}
              onChange={(e) => setValues((v) => ({ ...v, minOrderQty: Number(e.target.value) }))}
              className={inputClass}
            />
          </FormField>
          <FormField label="پله افزایش سفارش" htmlFor="stepQty">
            <input
              id="stepQty"
              type="number"
              min={1}
              value={values.stepQty}
              onChange={(e) => setValues((v) => ({ ...v, stepQty: Number(e.target.value) }))}
              className={inputClass}
            />
          </FormField>
          <FormField label="موجودی انبار" htmlFor="stockQuantity">
            <input
              id="stockQuantity"
              type="number"
              min={0}
              value={values.stockQuantity}
              onChange={(e) => setValues((v) => ({ ...v, stockQuantity: Number(e.target.value) }))}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="تصویر محصول (فقط اسم فایل، بدون پسوند)" htmlFor="imageInput">
          <p className="mb-1.5 -mt-1 text-xs text-neutral-400">
            مثال: اگه فایلت تو مسیر <code dir="ltr" className="rounded bg-neutral-100 px-1">public/sib_red.jpg</code> پروژه‌ست،
            فقط بنویس <code dir="ltr" className="rounded bg-neutral-100 px-1">sib_red</code> (نه public/ و نه پسوند jpg).
          </p>
          <div className="flex gap-2">
            <input
              id="imageInput"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addImage()
                }
              }}
              placeholder="sib_red"
              dir="ltr"
              className={inputClass}
            />
            <button type="button" onClick={addImage} className="rounded-xl bg-neutral-100 px-3 text-sm hover:bg-neutral-200">
              افزودن
            </button>
          </div>
          {values.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {values.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <SafeImage
                    src={img}
                    alt={`تصویر ${idx + 1}`}
                    className="h-20 w-20 rounded-lg border border-neutral-200 object-cover"
                    fallbackClassName="h-20 w-20 rounded-lg border border-red-200 bg-red-50 text-red-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label="حذف تصویر"
                    className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow"
                  >
                    ×
                  </button>
                  <p className="mt-1 max-w-20 truncate text-center text-[10px] text-neutral-400" dir="ltr">
                    {img}
                  </p>
                </div>
              ))}
            </div>
          )}
        </FormField>

        <FormField label="توضیحات" htmlFor="description">
          <textarea
            id="description"
            rows={3}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            className={inputClass}
          />
        </FormField>

        <div className="flex flex-wrap gap-4 pt-2">
          {[
            { key: "inStock" as const, label: "موجود است" },
            { key: "isSpecialOffer" as const, label: "پیشنهاد ویژه" },
            { key: "isBestSeller" as const, label: "پرفروش" },
            { key: "isDailyDeal" as const, label: "پیشنهاد روزانه" },
            { key: "isActive" as const, label: "فعال / قابل نمایش" },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={values[opt.key] as boolean}
                onChange={(e) => setValues((v) => ({ ...v, [opt.key]: e.target.checked }))}
                className="h-4 w-4 rounded border-neutral-300 text-emerald-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره محصول"}
        </button>
      </div>
    </form>
  )
}
