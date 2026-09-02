import { Skeleton, SkeletonText } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-56" />
      <div className="rounded-card border border-border p-4">
        <SkeletonText lines={3} />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
