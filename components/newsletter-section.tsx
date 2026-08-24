"use client"

import { useState, type FormEvent } from "react"
import { Mail, CheckCircle2, Loader2 } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!json.success) {
        setStatus("error")
        setMessage(json.error?.message ?? "خطایی رخ داد.")
        return
      }
      setStatus("done")
      setMessage(json.data.alreadySubscribed ? "شما قبلاً عضو شده‌اید!" : "با موفقیت عضو خبرنامه شدید 🎉")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("خطا در برقراری ارتباط. دوباره تلاش کنید.")
    }
  }

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-emerald-700 via-emerald-600 to-teal-600 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-14 -right-14 h-52 w-52 rounded-full bg-white/10" />

        <div className="relative mx-auto max-w-lg">
          <Mail className="mx-auto mb-4 h-9 w-9" />
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">از تخفیف‌های هفتگی باخبر شو</h2>
          <p className="mb-6 text-sm text-white/80 sm:text-base">
            ایمیلت رو وارد کن تا پیشنهادهای ویژه و محصولات فصلی رو زودتر از همه ببینی
          </p>

          {status === "done" ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5" />
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full flex-1 rounded-xl border-0 px-4 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                عضویت
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-2 text-xs text-red-100">{message}</p>}
        </div>
      </div>
    </section>
  )
}
