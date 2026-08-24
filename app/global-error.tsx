"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html dir="rtl" lang="fa">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-neutral-800 sm:text-2xl">مشکلی پیش اومد</h1>
          <p className="mb-8 max-w-sm text-neutral-500">
            یه خطای غیرمنتظره رخ داد. دوباره تلاش کن یا برگرد به صفحه اصلی.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <RotateCcw className="h-4 w-4" />
              تلاش دوباره
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              <Home className="h-4 w-4" />
              صفحه اصلی
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
