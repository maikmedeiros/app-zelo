'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api/client';
import { ptBR } from '@/shared/i18n/pt-BR';

export function SignOutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    setIsSigningOut(true);

    try {
      await authApi.logout();
    } finally {
      queryClient.clear();

      startTransition(() => {
        router.replace('/login');
        router.refresh();
      });
    }
  };

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isSigningOut || isPending}
      className="self-start rounded-control border border-border px-4 py-2 font-medium hover:bg-surface-muted disabled:opacity-60"
    >
      {isSigningOut || isPending ? ptBR.auth.signingOut : ptBR.auth.signOut}
    </button>
  );
}
