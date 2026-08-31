'use client';

import { ErrorState } from '@/shared/components/error-state';

export default function AppError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <ErrorState onRetry={retry} />
    </main>
  );
}
