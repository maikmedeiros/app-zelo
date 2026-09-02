'use client';

import { CalendarX } from 'lucide-react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { revokeClassAccess } from '../api/revoke-class-access.client';
import { isCurrent, type ClassAccessOutput } from '../types';

export function EndClassAccessButton({ access }: { access: ClassAccessOutput }) {
  const { run, pending } = useApiAction();
  const canRevoke = useCan(Feature.ClassAccessRevoke);

  if (!canRevoke || !isCurrent(access)) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={pending}>
          <CalendarX aria-hidden className="size-4" />
          Encerrar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title={`Encerrar o acesso de ${access.userName}?`}
        description={`A conta deixa de ver ${access.className} a partir de hoje. A concessão continua na trilha, com o motivo e quem a assinou — é ela que responde por que esta pessoa viu esta turma.`}
        confirmLabel="Encerrar"
        pending={pending}
        onConfirm={() =>
          void run(() => revokeClassAccess(access.id), {
            success: 'Acesso encerrado',
            failure: 'Não foi possível encerrar o acesso',
          })
        }
      />
    </AlertDialog>
  );
}
