'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Switch } from '@/shared/components/switch';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { PersonPicker } from '@/modules/people/components/person-picker';
import { createTeacher } from '../api/create-teacher.client';
import { updateTeacher } from '../api/update-teacher.client';
import { createTeacherSchema, updateTeacherSchema } from '../schemas/teacher-form';
import type { TeacherOutput } from '../types';

const orNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

export interface TeacherFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: TeacherOutput;
}

export function TeacherFormDialog({ open, onOpenChange, teacher }: TeacherFormDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();

  const [personId, setPersonId] = useState<string | null>(null);
  const [registration, setRegistration] = useState(teacher?.registration ?? '');
  const [education, setEducation] = useState(teacher?.education ?? '');
  const [active, setActive] = useState(teacher?.active ?? true);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    if (teacher === undefined) {
      const parsed = createTeacherSchema.safeParse({
        personId,
        registration: orNull(registration),
        education: orNull(education),
      });

      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message);
        return;
      }

      await run(() => createTeacher(parsed.data), {
        success: 'Professor cadastrado',
        failure: 'Não foi possível cadastrar o professor',
        onSuccess: () => onOpenChange(false),
      });

      return;
    }

    const nextRegistration = orNull(registration);
    const nextEducation = orNull(education);

    const parsed = updateTeacherSchema.safeParse({
      ...(nextRegistration === teacher.registration ? {} : { registration: nextRegistration }),
      ...(nextEducation === teacher.education ? {} : { education: nextEducation }),
      ...(active === teacher.active ? {} : { active }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updateTeacher(teacher.id, parsed.data), {
      success: 'Professor atualizado',
      failure: 'Não foi possível salvar o professor',
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={teacher === undefined ? 'Novo professor' : `Editar ${teacher.personName}`}
        description={
          teacher === undefined
            ? 'A pessoa já precisa estar cadastrada e ter CPF.'
            : 'Nome, CPF e contato são da pessoa e mudam na ficha dela.'
        }
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-professor" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-professor"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          {teacher === undefined && (
            <Field
              id="professor-pessoa"
              label="Pessoa"
              required
              error={fieldErrors.personId ?? formError}
            >
              <PersonPicker
                id="professor-pessoa"
                value={personId}
                onChange={setPersonId}
                invalid={fieldErrors.personId !== undefined}
              />
            </Field>
          )}

          <Field
            id="professor-registro"
            label="Matrícula funcional"
            error={fieldErrors.registration}
          >
            <Input
              id="professor-registro"
              value={registration}
              maxLength={30}
              autoComplete="off"
              aria-invalid={fieldErrors.registration !== undefined}
              onChange={(event) => setRegistration(event.target.value)}
            />
          </Field>

          <Field id="professor-formacao" label="Formação" error={fieldErrors.education}>
            <Textarea
              id="professor-formacao"
              rows={3}
              value={education}
              maxLength={2000}
              aria-invalid={fieldErrors.education !== undefined}
              onChange={(event) => setEducation(event.target.value)}
            />
          </Field>

          {teacher !== undefined && (
            <Switch
              id="professor-ativo"
              label="Professor ativo"
              checked={active}
              onCheckedChange={setActive}
            />
          )}

          {teacher !== undefined && formError !== undefined && (
            <p className="text-sm text-danger">{formError}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
