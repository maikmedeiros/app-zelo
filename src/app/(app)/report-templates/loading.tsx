import { Skeleton } from '@/shared/components/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-16 w-72" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
