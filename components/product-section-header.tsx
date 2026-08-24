import Link from "next/link"
import { ArrowLeft, type LucideIcon } from "lucide-react"

interface ProductSectionHeaderProps {
  icon: LucideIcon
  badgeLabel: string
  title: string
  viewAllHref: string
  badgeClassName: string
  bgClassName: string
}

export function ProductSectionHeader({
  icon: Icon,
  badgeLabel,
  title,
  viewAllHref,
  badgeClassName,
  bgClassName,
}: ProductSectionHeaderProps) {
  return (
    <div className={`mb-8 flex items-center justify-between rounded-2xl p-5 sm:mb-10 sm:p-6 ${bgClassName}`}>
      <div>
        <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}>
          <Icon className="h-3.5 w-3.5" />
          {badgeLabel}
        </div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      </div>
      <Link
        href={viewAllHref}
        className="hidden shrink-0 items-center gap-1 text-sm font-medium text-emerald-700 hover:underline sm:flex"
      >
        مشاهده همه
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  )
}
