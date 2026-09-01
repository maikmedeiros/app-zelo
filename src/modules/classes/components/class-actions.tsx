'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { deleteClass } from '../api/delete-class.client';
import type { ClassOutput } from '../types';
import { ClassFormDialog } from './class-form-dialog';

export interface ClassActionsProps {
  turma: ClassOutput;
  redirectOnDelete?: boolean;
}

export function ClassActions({ turma, redirectOnDelete = false }: ClassActionsProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const canUpdate = useCan(Feature.ClassUpdate);
  const canDelete = useCan(Feature.ClassDelete);
  const [editing, setEditing] = useState(false);

  if (!canUpdate && !canDelete) return null;

  const remove = () =>
    run(() => deleteClass(turma.id), {
      success: 'Turma removida',
      failure: 'Não foi possível remover a turma',
      onSuccess: () => {
        if (redirectOnDelete) router.push('/classes');
      },
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Ações da turma ${turma.name}`}
          className="inline-flex size-11 items-center justify-center rounded-control hover:bg-surface-muted"
        >
          <MoreVertical aria-hidden className="size-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {canUpdate && (
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              <Pencil aria-hidden className="size-4" />
              Editar
            </DropdownMenuItem>
          )}

          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <Trash2 aria-hidden className="size-4" />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent
                title={`Excluir a turma ${turma.name}?`}
                description="Só sai do banco turma que nunca recebeu matrícula, vínculo ou postagem. Se já recebeu, a API recusa e diz o motivo."
                confirmLabel="Excluir"
                pending={pending}
                onConfirm={() => void remove()}
              />
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {editing && <ClassFormDialog open={editing} onOpenChange={setEditing} turma={turma} />}
    </>
  );
}
