'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Select } from '@/shared/components/select';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { useFindListSchoolYears } from '@/modules/school-years/api/find-list-school-years.client';
import { createClass } from '../api/create-class.client';
import { updateClass } from '../api/update-class.client';
import { createClassSchema, updateClassSchema } from '../schemas/class-form';
import { CLASS_SHIFTS, type ClassOutput, type ClassShift } from '../types';

const SHIFT_OPTIONS = CLASS_SHIFTS.map((shift) => ({
  value: shift,
  label: ptBR.enums.classShift[shift],
}));

export interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turma?: ClassOutput;
}

export function ClassFormDialog({ open, onOpenChange, turma }: ClassFormDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();
  const schoolYears = useFindListSchoolYears();

  const [name, setName] = useState(turma?.name ?? '');
  const [segment, setSegment] = useState(turma?.segment ?? 'Educação Infantil');
  const [shift, setShift] = useState<ClassShift>(turma?.shift ?? 'MANHA');
  const [schoolYearId, setSchoolYearId] = useState<string | null>(turma?.schoolYearId ?? null);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const years = schoolYears.data?.results ?? [];
  const currentYear = new Date().getFullYear();
  const suggestedYear = years.find((year) => year.year === currentYear) ?? years[0];
  const chosenYearId = schoolYearId ?? suggestedYear?.id ?? null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    if (turma === undefined) {
      const parsed = createClassSchema.safeParse({
        schoolYearId: chosenYearId,
        name,
        segment,
        shift,
      });

      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message);
        return;
      }

      await run(() => createClass(parsed.data), {
        success: 'Turma criada',
        failure: 'Não foi possível criar a turma',
        onSuccess: () => onOpenChange(false),
      });

      return;
    }

    const changed = {
      ...(name.trim() === turma.name ? {} : { name }),
      ...(segment.trim() === turma.segment ? {} : { segment }),
      ...(shift === turma.shift ? {} : { shift }),
    };

    const parsed = updateClassSchema.safeParse(changed);

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updateClass(turma.id, parsed.data), {
      success: 'Turma atualizada',
      failure: 'Não foi possível salvar a turma',
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={turma === undefined ? 'Nova turma' : 'Editar turma'}
        description={
          turma === undefined
            ? 'A turma nasce dentro de um ano letivo e recebe alunos por matrícula.'
            : 'O ano letivo não muda: mover a turma levaria matrículas e postagens junto.'
        }
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-turma" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        }
      >
        <form id="formulario-turma" onSubmit={submit} noValidate className="flex flex-col gap-4">
          {turma === undefined && (
            <Field id="turma-ano" label="Ano letivo" required error={fieldErrors.schoolYearId}>
              <Select
                id="turma-ano"
                value={chosenYearId ?? undefined}
                onValueChange={setSchoolYearId}
                placeholder="Selecione o ano letivo"
                invalid={fieldErrors.schoolYearId !== undefined}
                options={years.map((year) => ({
                  value: year.id,
                  label: `${year.year}`,
                }))}
              />
            </Field>
          )}

          <Field id="turma-nome" label="Nome" required error={fieldErrors.name ?? formError}>
            <Input
              id="turma-nome"
              value={name}
              maxLength={100}
              autoComplete="off"
              aria-invalid={fieldErrors.name !== undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field id="turma-segmento" label="Segmento" required error={fieldErrors.segment}>
            <Input
              id="turma-segmento"
              value={segment}
              maxLength={100}
              autoComplete="off"
              aria-invalid={fieldErrors.segment !== undefined}
              onChange={(event) => setSegment(event.target.value)}
            />
          </Field>

          <Field id="turma-turno" label="Turno" required error={fieldErrors.shift}>
            <Select
              id="turma-turno"
              value={shift}
              onValueChange={(value) => setShift(value as ClassShift)}
              invalid={fieldErrors.shift !== undefined}
              options={SHIFT_OPTIONS}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
