"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  ShoppingCart,
  Menu,
  Phone,
  ChevronDown,
  Home,
  Tag,
  PartyPopper,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { ICategory, IOccasion } from "@/types"
import { SafeImage } from "@/components/safe-image"

function CategoryRow({ category, onNavigate }: { category: ICategory; onNavigate?: () => void }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      onClick={onNavigate}
      className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-orange-300 hover:bg-muted/30"
    >
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <SafeImage src={category.image || "/placeholder.svg"} alt={category.name} className="h-full w-full object-cover" fallbackClassName="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <h4 className="text-sm font-bold text-foreground">{category.name}</h4>
          {category.description && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{category.description}</p>
          )}
          {category.subCategories?.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-end gap-1">
              {category.subCategories.slice(0, 4).map((sub) => (
                <Badge key={sub} variant="secondary" className="text-[10px] font-normal">
                  {sub}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function CategoriesPanel({ categories, onNavigate }: { categories: ICategory[]; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border px-4 py-3 text-center">
        <h3 className="text-base font-bold text-foreground">دسته‌بندی محصولات</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">انتخاب از بین دسته‌های مختلف</p>
      </div>
      <div className="max-h-[min(60vh,22rem)] overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <CategoryRow key={category._id} category={category} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-right">
          <h4 className="text-sm font-medium text-foreground">نیاز به مشاوره؟</h4>
          <p className="text-xs text-muted-foreground">تیم متخصص ما آماده کمک است</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" className="h-8 flex-1 text-xs sm:flex-none" asChild>
            <Link href="/category" onClick={onNavigate}>همه دسته‌ها</Link>
          </Button>
          <Button size="sm" className="h-8 flex-1 bg-orange-600 text-xs hover:bg-orange-700 sm:flex-none" asChild>
            <Link href="/contact" onClick={onNavigate}>
              <Phone className="ml-1 h-3 w-3" />
              تماس
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const navLinkClass =
  "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"

interface HeaderProps {
  categories?: ICategory[]
  occasions?: IOccasion[]
}

export function Header({ categories = [], occasions = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { items } = useCart()
  const router = useRouter()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const navLinksBefore = [
    { href: "/", label: "صفحه اصلی", icon: Home },
    { href: "/special-offers", label: "فروش ویژه", icon: Tag },
  ]

  const navLinksAfter = [
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ]

  const closeMenus = () => {
    setIsMobileMenuOpen(false)
    setIsCategoriesOpen(false)
    setIsOccasionsOpen(false)
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = searchValue.trim()
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products")
    closeMenus()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#81C784] shadow-lg">
      <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-4 sm:py-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-[#263238] sm:text-xl">تره بار</h1>
              <p className="text-[10px] text-[#37474F] sm:text-xs">میوه و صیفی‌جات به قیمت تره‌بار مرکزی</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 md:mx-6 md:block md:max-w-xl lg:max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="w-full bg-white/90 py-2 pr-4 pl-11"
              />
              <button type="submit" aria-label="جستجو" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative h-9 border-white/60 bg-white/90 sm:h-10">
                <ShoppingCart className="ml-1.5 h-4 w-4" />
                <span className="hidden sm:inline">سبد خرید</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 px-1.5 py-0 text-[10px]">{totalItems}</Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="h-9 border-white/60 bg-white/90 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mt-2 md:hidden">
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="جستجو در محصولات..."
            className="w-full bg-white/90 py-2 pr-4 pl-11"
          />
          <button type="submit" aria-label="جستجو" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden border-t border-[#6d9f70] bg-[#6d9f70] md:block">
        <div className="mx-auto flex w-full max-w-7xl justify-center px-4 py-1.5">
          <ul className="flex flex-wrap items-center justify-center gap-0.5">
            {navLinksBefore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Popover open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(navLinkClass, "gap-1")}>
                    دسته‌بندی‌ها
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isCategoriesOpen && "rotate-180")} />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[min(92vw,26rem)] p-0">
                  <CategoriesPanel categories={categories} onNavigate={closeMenus} />
                </PopoverContent>
              </Popover>
            </li>

            <li>
              <Popover open={isOccasionsOpen} onOpenChange={setIsOccasionsOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={cn(navLinkClass, "gap-1")}>
                    <PartyPopper className="h-3.5 w-3.5" />
                    مناسبت‌ها
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOccasionsOpen && "rotate-180")} />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[min(92vw,20rem)] p-3">
                  <div className="flex flex-col gap-1.5">
                    {occasions.map((occ) => (
                      <Link
                        key={occ._id}
                        href={`/occasions/${occ.slug}`}
                        onClick={closeMenus}
                        className={`rounded-lg bg-gradient-to-l px-3 py-2 text-sm font-medium text-white ${occ.color}`}
                      >
                        {occ.name}
                      </Link>
                    ))}
                    {occasions.length === 0 && <p className="text-xs text-muted-foreground">هنوز مناسبتی ثبت نشده</p>}
                  </div>
                </PopoverContent>
              </Popover>
            </li>

            {navLinksAfter.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-right">منو</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 p-4">
            {[...navLinksBefore, ...navLinksAfter].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/occasions"
              onClick={closeMenus}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              مناسبت‌ها
            </Link>
          </div>
          <div className="border-t px-4 py-3">
            <CategoriesPanel categories={categories} onNavigate={closeMenus} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
