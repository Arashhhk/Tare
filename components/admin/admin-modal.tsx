"use client"

import { X } from "lucide-react"
import type { ReactNode } from "react"

interface AdminModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  widthClass?: string
}

export function AdminModal({ open, title, onClose, children, widthClass = "max-w-lg" }: AdminModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-8" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-full ${widthClass} rounded-2xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h3 className="text-base font-bold text-neutral-900">{title}</h3>
          <button onClick={onClose} aria-label="بستن" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
