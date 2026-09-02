'use client';

import { ErrorState } from '@/shared/components/error-state';

export default function ReportError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col justify-center py-12">
      <ErrorState
        title="O relatório não carregou"
        description="O que já estava salvo continua salvo — o relatório se grava a cada alteração. Tente abrir de novo."
        onRetry={retry}
      />
    </div>
  );
}
