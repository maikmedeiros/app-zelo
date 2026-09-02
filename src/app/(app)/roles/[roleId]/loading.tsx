import { Skeleton, SkeletonText } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Skeleton className="h-8 w-56" />
      <div className="rounded-card border border-border p-4">
        <SkeletonText lines={3} />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
