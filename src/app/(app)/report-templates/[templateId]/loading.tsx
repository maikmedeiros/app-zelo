import { Skeleton, SkeletonText } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Skeleton className="h-8 w-64" />

      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="rounded-card border border-border p-4">
          <SkeletonText lines={3} />
        </div>
      ))}
    </div>
  );
}
