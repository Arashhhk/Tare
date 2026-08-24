"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User, Lock, UserCircle, ShieldCheck, CheckCircle2 } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"

export default function AdminSetupPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)

  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    apiFetch<{ setupRequired: boolean }>("/api/admin/setup").then(({ data }) => {
      if (!active) return
      setSetupRequired(Boolean(data?.setupRequired))
      setChecking(false)
    })
    return () => {
      active = false
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.")
      return
    }

    setSubmitting(true)
    const { error: apiError } = await apiFetch("/api/admin/setup", {
      method: "POST",
      body: JSON.stringify({ username, password, fullName }),
    })
    setSubmitting(false)

    if (apiError) {
      setError(apiError)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!setupRequired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 text-center">
        <div className="max-w-sm">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h1 className="mb-2 text-lg font-bold text-neutral-900">راه‌اندازی قبلاً انجام شده</h1>
          <p className="mb-6 text-sm text-neutral-500">
            حداقل یک حساب ادمین در سیستم وجود دارد. برای ورود به پنل از صفحه‌ی لاگین استفاده کنید.
          </p>
          <button
            onClick={() => router.push("/admin/login")}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            رفتن به صفحه ورود
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">راه‌اندازی اولیه پنل مدیریت</h1>
          <p className="mt-1 text-sm text-neutral-500">
            اولین حساب ادمین (با دسترسی کامل) را بسازید. این صفحه فقط یک‌بار قابل استفاده است.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-neutral-700">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <UserCircle className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 py-2.5 pr-10 pl-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="مثلا: علی رضایی"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-neutral-700">
              نام کاربری (برای ورود به پنل)
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="username"
                required
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 py-2.5 pr-10 pl-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
              رمز عبور (حداقل ۸ کاراکتر، شامل حرف و عدد)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="password"
                type="password"
                required
                minLength={8}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 py-2.5 pr-10 pl-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-neutral-700">
              تکرار رمز عبور
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="confirmPassword"
                type="password"
                required
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 py-2.5 pr-10 pl-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "در حال ساخت حساب..." : "ساخت حساب ادمین و ورود"}
          </button>
        </form>
      </div>
    </div>
  )
}
