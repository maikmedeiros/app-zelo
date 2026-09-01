import { Skeleton, SkeletonText } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-16 w-full" />

      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-card border border-border p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <SkeletonText lines={3} />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  );
}
