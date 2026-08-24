import Link from "next/link"
import { ChevronLeft, Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: "/" },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: item.href } : {}),
      })),
    ],
  }

  return (
    <nav aria-label="مسیر صفحه" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-neutral-500 sm:text-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="flex items-center gap-1 transition hover:text-emerald-700">
        <Home className="h-3.5 w-3.5" />
        صفحه اصلی
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5 text-neutral-300" />
          {item.href ? (
            <Link href={item.href} className="transition hover:text-emerald-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-neutral-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
