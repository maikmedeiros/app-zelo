import { Skeleton, SkeletonText } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Skeleton className="h-8 w-2/3" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <SkeletonText lines={6} />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
