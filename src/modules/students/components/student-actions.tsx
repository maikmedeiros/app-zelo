'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical, Pencil, Power, Trash2 } from 'lucide-react';
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
import { deleteStudent } from '../api/delete-student.client';
import { updateStudent } from '../api/update-student.client';
import type { StudentOutput } from '../types';
import { StudentFormDialog } from './student-form-dialog';

export interface StudentActionsProps {
  student: StudentOutput;
  redirectOnDelete?: boolean;
}

export function StudentActions({ student, redirectOnDelete = false }: StudentActionsProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const canUpdate = useCan(Feature.StudentUpdate);
  const canDelete = useCan(Feature.StudentDelete);
  const [editing, setEditing] = useState(false);

  if (!canUpdate && !canDelete) return null;

  const toggleActive = () =>
    run(() => updateStudent(student.id, { active: !student.active }), {
      success: student.active ? 'Aluno desativado' : 'Aluno reativado',
      failure: 'Não foi possível mudar a situação do aluno',
    });

  const remove = () =>
    run(() => deleteStudent(student.id), {
      success: 'Aluno removido',
      failure: 'Não foi possível remover o aluno',
      onSuccess: () => {
        if (redirectOnDelete) router.push('/students');
      },
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Ações de ${student.personName}`}
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

          {canUpdate && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <Power aria-hidden className="size-4" />
                  {student.active ? 'Desativar' : 'Reativar'}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent
                title={
                  student.active
                    ? `Desativar ${student.personName}?`
                    : `Reativar ${student.personName}?`
                }
                description={
                  student.active
                    ? 'A criança sai das listas do dia a dia e o histórico continua inteiro. É o caminho para quem deixou a escola.'
                    : 'A criança volta a aparecer nas listas do dia a dia.'
                }
                confirmLabel={student.active ? 'Desativar' : 'Reativar'}
                confirmVariant={student.active ? 'danger' : 'primary'}
                pending={pending}
                onConfirm={() => void toggleActive()}
              />
            </AlertDialog>
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
                title={`Excluir ${student.personName}?`}
                description="A exclusão serve para desfazer o cadastro recém-criado. Criança com matrícula, vínculo ou postagem sai por desativação, e a API recusa a exclusão dizendo isso."
                confirmLabel="Excluir"
                pending={pending}
                onConfirm={() => void remove()}
              />
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {editing && <StudentFormDialog open={editing} onOpenChange={setEditing} student={student} />}
    </>
  );
}
