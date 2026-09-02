'use client';

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
import { ptBR } from '@/shared/i18n/pt-BR';
import { deleteSchoolYear } from '../api/delete-school-year.client';
import { SchoolYearDialog } from './school-year-dialog';
import type { SchoolYearOutput } from '../types';

export function SchoolYearActions({ schoolYear }: { schoolYear: SchoolYearOutput }) {
  const { run, pending } = useApiAction();
  const canUpdate = useCan(Feature.SchoolYearUpdate);
  const canDelete = useCan(Feature.SchoolYearDelete);
  const [editing, setEditing] = useState(false);

  if (!canUpdate && !canDelete) return null;

  const hasClasses = schoolYear.classCount > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Ações do ano letivo ${schoolYear.year}`}
          className="inline-flex size-11 items-center justify-center rounded-control hover:bg-surface-muted"
        >
          <MoreVertical aria-hidden className="size-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {canUpdate && (
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              <Pencil aria-hidden className="size-4" />
              Alterar
            </DropdownMenuItem>
          )}

          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <Trash2 aria-hidden className="size-4" />
                  {ptBR.common.remove}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent
                title={hasClasses ? 'Este ano tem turmas' : 'Remover o ano letivo?'}
                description={
                  hasClasses
                    ? `São ${schoolYear.classCount} turmas neste ano. A API recusa remover, porque apagar o ano apagaria o contexto das turmas — mova ou encerre as turmas antes.`
                    : 'Sem turmas, o ano letivo some sem deixar rastro.'
                }
                confirmLabel={ptBR.common.remove}
                pending={pending}
                onConfirm={() =>
                  void run(() => deleteSchoolYear(schoolYear.id), {
                    success: 'Ano letivo removido',
                    failure: 'Não foi possível remover',
                  })
                }
              />
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {editing && (
        <SchoolYearDialog schoolYear={schoolYear} open={editing} onOpenChange={setEditing} />
      )}
    </>
  );
}
