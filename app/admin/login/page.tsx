"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Lock, User } from "lucide-react"
import { apiFetch } from "@/lib/admin-api"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSetup, setCheckingSetup] = useState(true)

  // اگر هنوز هیچ ادمینی ساخته نشده، به‌جای فرم ورود، کاربر را به صفحه‌ی راه‌اندازی اولیه می‌فرستیم
  useEffect(() => {
    let active = true
    apiFetch<{ setupRequired: boolean }>("/api/admin/setup").then(({ data }) => {
      if (!active) return
      if (data?.setupRequired) {
        router.replace("/admin/setup")
        return
      }
      setCheckingSetup(false)
    })
    return () => {
      active = false
    }
  }, [router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: apiError } = await apiFetch<{ admin: unknown }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    setLoading(false)

    if (apiError) {
      setError(apiError)
      return
    }

    const next = searchParams.get("next") || "/admin"
    router.push(next)
    router.refresh()
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="w-full max-w-sm">
        {checkingSetup ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : (
        <>
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white text-2xl font-bold shadow-lg shadow-emerald-600/20">
            ت
          </div>
          <h1 className="text-xl font-bold text-neutral-900">ورود به پنل مدیریت</h1>
          <p className="mt-1 text-sm text-neutral-500">دسترسی محدود به کارکنان مجاز</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-neutral-700">
              نام کاربری
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
              رمز عبور
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
        </>
        )}
      </div>
    </div>
  )
}
