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
import { createStudent } from '../api/create-student.client';
import { updateStudent } from '../api/update-student.client';
import { createStudentSchema, updateStudentSchema } from '../schemas/student-form';
import type { StudentOutput } from '../types';

const trimmedOrNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

export interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentOutput;
}

export function StudentFormDialog({ open, onOpenChange, student }: StudentFormDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();

  const [personId, setPersonId] = useState<string | null>(null);
  const [code, setCode] = useState(student?.code ?? '');
  const [notes, setNotes] = useState(student?.notes ?? '');
  const [active, setActive] = useState(student?.active ?? true);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    if (student === undefined) {
      const parsed = createStudentSchema.safeParse({
        personId,
        code: trimmedOrNull(code),
        notes: trimmedOrNull(notes),
      });

      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message);
        return;
      }

      await run(() => createStudent(parsed.data), {
        success: 'Aluno cadastrado',
        failure: 'Não foi possível cadastrar o aluno',
        onSuccess: () => onOpenChange(false),
      });

      return;
    }

    const nextCode = trimmedOrNull(code);
    const nextNotes = trimmedOrNull(notes);

    const parsed = updateStudentSchema.safeParse({
      ...(nextCode === student.code ? {} : { code: nextCode }),
      ...(nextNotes === student.notes ? {} : { notes: nextNotes }),
      ...(active === student.active ? {} : { active }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updateStudent(student.id, parsed.data), {
      success: 'Aluno atualizado',
      failure: 'Não foi possível salvar o aluno',
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={student === undefined ? 'Novo aluno' : `Editar ${student.personName}`}
        description={
          student === undefined
            ? 'A criança já precisa estar cadastrada como pessoa. Aqui ela ganha o papel de aluno.'
            : 'A pessoa por trás do aluno não muda: trocá-la moveria matrícula, vínculo e postagem para outra criança.'
        }
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-aluno" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        }
      >
        <form id="formulario-aluno" onSubmit={submit} noValidate className="flex flex-col gap-4">
          {student === undefined && (
            <Field
              id="aluno-pessoa"
              label="Pessoa"
              required
              hint="A lista traz quem foi cadastrado e ainda não tem papel."
              error={fieldErrors.personId ?? formError}
            >
              <PersonPicker
                id="aluno-pessoa"
                value={personId}
                onChange={setPersonId}
                role="none"
                invalid={fieldErrors.personId !== undefined}
              />
            </Field>
          )}

          <Field
            id="aluno-codigo"
            label="Código de matrícula"
            hint="Opcional. É o código que a secretaria usa."
            error={fieldErrors.code}
          >
            <Input
              id="aluno-codigo"
              value={code}
              maxLength={20}
              autoComplete="off"
              aria-invalid={fieldErrors.code !== undefined}
              onChange={(event) => setCode(event.target.value)}
            />
          </Field>

          <Field
            id="aluno-observacoes"
            label="Observações"
            hint="Alergias, cuidados e combinados com a família."
            error={fieldErrors.notes}
          >
            <Textarea
              id="aluno-observacoes"
              rows={3}
              value={notes}
              maxLength={2000}
              aria-invalid={fieldErrors.notes !== undefined}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Field>

          {student !== undefined && (
            <Switch
              id="aluno-ativo"
              label="Aluno ativo"
              checked={active}
              onCheckedChange={setActive}
            />
          )}

          {student !== undefined && formError !== undefined && (
            <p className="text-sm text-danger">{formError}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
