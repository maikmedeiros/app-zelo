'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createSchoolYear } from '../api/create-school-year.client';
import { updateSchoolYear } from '../api/update-school-year.client';
import { createSchoolYearSchema, updateSchoolYearSchema } from '../schemas/school-year-form';
import type { SchoolYearOutput } from '../types';

export function SchoolYearDialog({
  schoolYear,
  open,
  onOpenChange,
}: {
  schoolYear?: SchoolYearOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { run, pending, fieldErrors } = useApiAction();
  const editing = schoolYear !== undefined;

  const [year, setYear] = useState(String(schoolYear?.year ?? new Date().getFullYear()));
  const [startDate, setStartDate] = useState(schoolYear?.startDate ?? '');
  const [endDate, setEndDate] = useState(schoolYear?.endDate ?? '');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const raw = { year, startDate, endDate };

    if (schoolYear !== undefined) {
      const parsed = updateSchoolYearSchema.safeParse(raw);

      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message);
        return;
      }

      await run(() => updateSchoolYear(schoolYear.id, parsed.data), {
        success: 'Ano letivo alterado',
        failure: 'Não foi possível alterar',
        onSuccess: () => onOpenChange(false),
      });

      return;
    }

    const parsed = createSchoolYearSchema.safeParse(raw);

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createSchoolYear(parsed.data), {
      success: 'Ano letivo criado',
      failure: 'Não foi possível criar',
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={editing ? 'Alterar ano letivo' : 'Novo ano letivo'}
        description="O ano letivo é o intervalo em que as turmas existem. É ele que separa a Maternal I A de 2026 da de 2027."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-ano" disabled={pending}>
              {pending ? 'Salvando…' : editing ? 'Salvar' : 'Criar ano letivo'}
            </Button>
          </>
        }
      >
        <form id="formulario-ano" onSubmit={submit} noValidate className="flex flex-col gap-4">
          <Field id="ano-numero" label="Ano" required error={fieldErrors.year ?? formError}>
            <Input
              id="ano-numero"
              type="number"
              min={2000}
              max={2100}
              value={year}
              aria-invalid={fieldErrors.year !== undefined}
              onChange={(event) => setYear(event.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ano-inicio" label="Início" required error={fieldErrors.startDate}>
              <DatePicker
                id="ano-inicio"
                value={startDate}
                aria-invalid={fieldErrors.startDate !== undefined}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </Field>

            <Field id="ano-fim" label="Fim" required error={fieldErrors.endDate}>
              <DatePicker
                id="ano-fim"
                value={endDate}
                aria-invalid={fieldErrors.endDate !== undefined}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </Field>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
