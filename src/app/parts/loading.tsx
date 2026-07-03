export default function PartsLoading() {
  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 h-10 w-64 animate-pulse rounded-lg bg-surface-light" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/3] animate-pulse bg-surface-light" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-surface-light" />
                <div className="h-6 w-full animate-pulse rounded bg-surface-light" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-light" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
