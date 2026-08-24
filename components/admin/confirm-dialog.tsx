"use client"

import { AlertTriangle, X } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تایید",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <button
          onClick={onCancel}
          aria-label="بستن"
          className="absolute left-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
        >
          <X className="h-4 w-4" />
        </button>
        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="mb-1.5 text-base font-bold text-neutral-900">{title}</h3>
        <p className="mb-5 text-sm text-neutral-600">{description}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-neutral-300 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
