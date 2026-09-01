import { Skeleton, SkeletonText } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-16 w-72" />

      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex gap-3 rounded-card border border-border p-4">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1">
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}
