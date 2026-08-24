export default function HomeLoading() {
  return (
    <div className="space-y-16">
      <div className="bg-[#81C784] py-4" />
      <div className="container">
        <div className="h-64 w-full animate-pulse rounded-3xl bg-neutral-200 sm:h-80" />
        <div className="mt-12 space-y-4">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-neutral-200" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-40 w-40 shrink-0 animate-pulse rounded-2xl bg-neutral-100 sm:w-52" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
