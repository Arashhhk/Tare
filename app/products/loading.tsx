export default function ProductsLoading() {
  return (
    <div>
      <div className="bg-[#81C784] py-4" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="mb-2 h-8 w-56 animate-pulse rounded-lg bg-neutral-200" />
          <div className="h-5 w-32 animate-pulse rounded-lg bg-neutral-100" />
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="hidden lg:col-span-1 lg:block">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:col-span-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="h-40 animate-pulse bg-neutral-100 sm:h-44" />
                <div className="space-y-2 p-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
                  <div className="h-9 w-full animate-pulse rounded-xl bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
