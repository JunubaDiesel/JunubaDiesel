export default function BuscarLoading() {
  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 h-10 w-48 animate-pulse rounded-lg bg-surface-light" />
        <div className="mb-8 h-14 animate-pulse rounded-2xl bg-surface-light" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-surface-light" />
          ))}
        </div>
      </div>
    </div>
  );
}
