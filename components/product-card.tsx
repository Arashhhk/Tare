"use client"

import Link from "next/link"
import { Star, TrendingUp, Percent } from "lucide-react"
import AddToCartButton from "@/components/add-to-cart-button"
import { SafeImage } from "@/components/safe-image"

export interface ProductCardData {
  _id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images?: string[]
  unit: string
  minOrderQty: number
  stepQty: number
  rating?: number
  ratingCount?: number
  inStock: boolean
  isBestSeller?: boolean
  isSpecialOffer?: boolean
}

function discountPercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount = discountPercent(product.price, product.originalPrice)
  const image = product.images?.[0] || "/placeholder.svg"

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <SafeImage
          src={image}
          alt={product.name}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-44"
          fallbackClassName="h-40 w-full sm:h-44"
        />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="flex items-center gap-0.5 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
              <Percent className="h-3 w-3" />
              {discount}٪
            </span>
          )}
          {product.isBestSeller && (
            <span className="flex items-center gap-0.5 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">
              <TrendingUp className="h-3 w-3" />
              پرفروش
            </span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-neutral-800">ناموجود</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="mb-1 line-clamp-1 text-sm font-bold text-neutral-800 transition-colors hover:text-emerald-700 sm:text-base">
            {product.name}
          </h3>
        </Link>

        {(product.rating ?? 0) > 0 && (
          <div className="mb-1.5 flex items-center gap-1 text-xs text-neutral-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating?.toFixed(1)}
            <span className="text-neutral-400">({product.ratingCount ?? 0})</span>
          </div>
        )}

        <div className="mb-3 mt-auto flex items-baseline gap-1.5">
          <span className="text-base font-bold text-neutral-900 sm:text-lg">{product.price.toLocaleString("fa-IR")}</span>
          <span className="text-xs text-neutral-500">تومان / {product.unit}</span>
          {discount > 0 && product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">{product.originalPrice.toLocaleString("fa-IR")}</span>
          )}
        </div>

        <AddToCartButton
          productId={product._id}
          name={product.name}
          price={product.price}
          image={image}
          unit={product.unit}
          minOrderQty={product.minOrderQty}
          stepQty={product.stepQty}
          inStock={product.inStock}
        />
      </div>
    </div>
  )
}
