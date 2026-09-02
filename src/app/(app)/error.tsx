'use client';

import { ErrorState } from '@/shared/components/error-state';

export default function AppSegmentError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col justify-center py-12">
      <ErrorState
        title="Esta tela não carregou"
        description="O resto do sistema continua funcionando. Tente de novo; se insistir, avise a coordenação."
        onRetry={retry}
      />
    </div>
  );
}
