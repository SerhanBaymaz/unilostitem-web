import { Skeleton } from '@/components/ui/skeleton';

export function ItemCardSkeleton() {
  return (
    <div className="rounded-lg bg-card p-6 shadow-warm-1">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-24 shrink-0 rounded-md" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-5 w-14 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItemDetailSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl space-y-6 p-4 md:p-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-14 rounded-sm" />
            <Skeleton className="h-5 w-20 rounded-sm" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-warm-1">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
