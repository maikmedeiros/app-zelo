'use client';

import { CloudOff } from 'lucide-react';
import { useOnline } from '@/shared/hooks/use-online';

export function OfflineBanner() {
  const online = useOnline();

  if (online) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-accent px-4 py-2 text-sm text-on-accent"
    >
      <CloudOff aria-hidden className="size-4 shrink-0" />
      Sem conexão. Você continua lendo o que já carregou, mas nada é salvo até a internet voltar.
    </div>
  );
}
