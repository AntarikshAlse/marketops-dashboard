import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border bg-background p-6">
      <h2 className="text-xl font-semibold">
        Something went wrong
      </h2>

      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error.message}
      </p>

      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}
