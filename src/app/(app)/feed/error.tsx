'use client';

import { ErrorState } from '@/shared/components/error-state';

export default function FeedError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col justify-center py-12">
      <ErrorState
        title="O feed não carregou"
        description="Nada foi perdido: as postagens continuam no servidor. Tente de novo em instantes."
        onRetry={retry}
      />
    </div>
  );
}
