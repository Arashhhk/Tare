"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface AddToCartButtonProps {
  productId: string
  name: string
  price: number
  image: string
  unit?: string
  minOrderQty?: number
  stepQty?: number
  inStock?: boolean
  className?: string
}

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  unit = "کیلو",
  minOrderQty = 1,
  stepQty = 1,
  inStock = true,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  function handleAddToCart() {
    if (!inStock) return
    addItem({
      id: productId,
      name,
      price,
      image,
      unit,
      minQty: minOrderQty,
      step: stepQty,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock}
      className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:bg-neutral-300 ${
        justAdded ? "bg-emerald-600" : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
      } ${className}`}
    >
      {!inStock ? (
        "ناموجود"
      ) : justAdded ? (
        <>
          <Check className="h-4 w-4" />
          افزوده شد
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          افزودن به سبد خرید
        </>
      )}
    </button>
  )
}
