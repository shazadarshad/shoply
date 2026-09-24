// Simple loading indicators. Kept minimal and non-animated beyond a subtle pulse.

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label={label}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="aspect-square w-full animate-pulse rounded-md bg-gray-200" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
