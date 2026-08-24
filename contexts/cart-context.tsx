"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  unit: string
  quantity: number
  step: number
  minQty: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  items: CartItem[]
  total: number
} | null>(null)

const STORAGE_KEY = "tare_cart_v1"

function computeTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload

    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.step || 1) }
            : item,
        )
        return { items: updatedItems, total: computeTotal(updatedItems) }
      }
      const newItems = [...state.items, { ...action.payload, quantity: action.payload.minQty || 1 }]
      return { items: newItems, total: computeTotal(newItems) }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return { items: newItems, total: computeTotal(newItems) }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)
      return { items: updatedItems, total: computeTotal(updatedItems) }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  // بازیابی سبد خرید از localStorage در بارگذاری اولیه (فقط سمت کلاینت)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as CartState
        dispatch({ type: "HYDRATE", payload: parsed })
      }
    } catch {
      // اگر دیتای خراب بود، نادیده گرفته می‌شود
    }
  }, [])

  // ذخیره سبد خرید در localStorage با هر تغییر
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // فضای ذخیره‌سازی پر یا در دسترس نیست؛ بی‌صدا رد می‌شویم
    }
  }, [state])

  const addItem = (item: Omit<CartItem, "quantity">) => dispatch({ type: "ADD_ITEM", payload: item })
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id })
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, items: state.items, total: state.total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart باید داخل CartProvider استفاده شود")
  return context
}
