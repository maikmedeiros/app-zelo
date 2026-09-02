'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Select } from '@/shared/components/select';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { todayIso } from '@/shared/utils/date';
import { ClassPicker } from '@/modules/classes/components/class-picker';
import { TeacherPicker } from '@/modules/teachers/components/teacher-picker';
import { createTeacherLink } from '../api/create-teacher-link.client';
import { createTeacherLinkSchema } from '../schemas/create-teacher-link';
import { TEACHER_ROLES, type TeacherRole } from '../types';

const ROLE_OPTIONS = TEACHER_ROLES.map((role) => ({
  value: role,
  label: ptBR.enums.teacherRole[role],
}));

export interface TeacherLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockedClassId?: string;
}

export function TeacherLinkDialog({ open, onOpenChange, lockedClassId }: TeacherLinkDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(lockedClassId ?? null);
  const [role, setRole] = useState<TeacherRole>('TITULAR');
  const [startDate, setStartDate] = useState(todayIso());
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createTeacherLinkSchema.safeParse({
      teacherId,
      classId: lockedClassId ?? classId,
      role,
      ...(startDate === '' ? {} : { startDate }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createTeacherLink(parsed.data), {
      success: 'Vínculo criado',
      failure: 'Não foi possível criar o vínculo',
      onSuccess: () => {
        setTeacherId(null);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Novo vínculo com turma"
        description="É o vínculo de professor que dá o escopo de escrita: quem publica na turma é a equipe dela."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-vinculo-professor" disabled={pending}>
              {pending ? 'Salvando…' : 'Criar vínculo'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-vinculo-professor"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Field
            id="vinculo-professor"
            label="Professor"
            required
            error={fieldErrors.teacherId ?? formError}
          >
            <TeacherPicker
              id="vinculo-professor"
              value={teacherId}
              onChange={setTeacherId}
              invalid={fieldErrors.teacherId !== undefined}
            />
          </Field>

          {lockedClassId === undefined && (
            <Field id="vinculo-turma" label="Turma" required error={fieldErrors.classId}>
              <ClassPicker
                id="vinculo-turma"
                value={classId}
                onChange={setClassId}
                invalid={fieldErrors.classId !== undefined}
              />
            </Field>
          )}

          <Field id="vinculo-funcao" label="Função" required error={fieldErrors.role}>
            <Select
              id="vinculo-funcao"
              value={role}
              onValueChange={(value) => setRole(value as TeacherRole)}
              options={ROLE_OPTIONS}
            />
          </Field>

          <Field
            id="vinculo-inicio"
            label="Início da vigência"
            hint="Em branco, a API grava a data de hoje."
            error={fieldErrors.startDate}
          >
            <DatePicker
              id="vinculo-inicio"
              value={startDate}
              aria-invalid={fieldErrors.startDate !== undefined}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
