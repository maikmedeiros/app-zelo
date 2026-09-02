'use client';

import { Undo2 } from 'lucide-react';
import { Feature } from '@/config/features';
import { useCan, useSession } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { revokeRoleGrant } from '../api/revoke-role-grant.client';
import { isCurrent, type RoleGrantOutput } from '../types';

export function RevokeRoleGrantButton({ grant }: { grant: RoleGrantOutput }) {
  const { run, pending } = useApiAction();
  const session = useSession();
  const canRevoke = useCan(Feature.RoleGrantRevoke);

  if (!canRevoke || !isCurrent(grant)) return null;

  const isSelf = grant.userId === session.id;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={pending || isSelf}>
          <Undo2 aria-hidden className="size-4" />
          Encerrar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title={isSelf ? 'Não dá para encerrar o próprio perfil' : 'Encerrar a concessão?'}
        description={
          isSelf
            ? 'A API recusa: quem se tira o próprio perfil pode ficar sem como devolvê-lo. Peça a outra conta com permissão.'
            : `${grant.userName} perde as permissões de ${grant.roleName} no próximo acesso. A concessão não some: fica no histórico com a data de fim.`
        }
        confirmLabel="Encerrar"
        pending={pending}
        onConfirm={() =>
          void run(() => revokeRoleGrant(grant.id), {
            success: 'Concessão encerrada',
            failure: 'Não foi possível encerrar',
          })
        }
      />
    </AlertDialog>
  );
}
