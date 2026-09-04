'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api/client';
import { useSession } from '@/shared/auth/session-context';
import { ptBR } from '@/shared/i18n/pt-BR';
import { Avatar } from '../avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { ThemeToggle, type ThemeChoice } from './theme-toggle';

export function UserMenu({ theme }: { theme: ThemeChoice }) {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);

    try {
      await authApi.logout();
    } finally {
      queryClient.clear();
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Conta de ${session.name}`}
        className="flex items-center gap-2 rounded-control p-1 hover:bg-surface-muted"
      >
        <Avatar name={session.name} personId={session.personId} size="sm" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block text-sm font-medium text-text">{session.name}</span>
          <span className="block">{session.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <ThemeToggle current={theme} />

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuItem disabled={signingOut} onSelect={() => void signOut()}>
          <LogOut aria-hidden className="size-4" />
          {signingOut ? ptBR.auth.signingOut : ptBR.auth.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
