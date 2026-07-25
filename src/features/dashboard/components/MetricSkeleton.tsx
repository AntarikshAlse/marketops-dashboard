export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-3">
          <div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
