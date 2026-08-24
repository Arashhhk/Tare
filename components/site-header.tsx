import { Header } from "@/components/header"
import { getActiveCategories, getActiveOccasions } from "@/lib/server-data"

export async function SiteHeader() {
  const [categories, occasions] = await Promise.all([getActiveCategories(), getActiveOccasions()])
  return <Header categories={categories} occasions={occasions} />
}
