'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { todayIso } from '@/shared/utils/date';
import { ClassPicker } from '@/modules/classes/components/class-picker';
import { StudentPicker } from '@/modules/students/components/student-picker';
import { createEnrollment } from '../api/create-enrollment.client';
import { createEnrollmentSchema } from '../schemas/create-enrollment';

export interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockedClassId?: string;
  lockedClassName?: string;
}

export function EnrollmentDialog({
  open,
  onOpenChange,
  lockedClassId,
  lockedClassName,
}: EnrollmentDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(lockedClassId ?? null);
  const [startDate, setStartDate] = useState(todayIso());
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createEnrollmentSchema.safeParse({
      studentId,
      classId: lockedClassId ?? classId,
      ...(startDate === '' ? {} : { startDate }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createEnrollment(parsed.data), {
      success: 'Aluno matriculado',
      failure: 'Não foi possível matricular',
      onSuccess: () => {
        setStudentId(null);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Matricular aluno"
        description={
          lockedClassName === undefined
            ? 'A matrícula é o que coloca a criança na turma e abre a agenda dela para a família.'
            : `A criança passa a fazer parte da turma ${lockedClassName}.`
        }
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-matricula" disabled={pending}>
              {pending ? 'Matriculando…' : 'Matricular'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-matricula"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Field
            id="matricula-aluno"
            label="Aluno"
            required
            error={fieldErrors.studentId ?? formError}
          >
            <StudentPicker
              id="matricula-aluno"
              value={studentId}
              onChange={setStudentId}
              invalid={fieldErrors.studentId !== undefined}
            />
          </Field>

          {lockedClassId === undefined && (
            <Field id="matricula-turma" label="Turma" required error={fieldErrors.classId}>
              <ClassPicker
                id="matricula-turma"
                value={classId}
                onChange={setClassId}
                invalid={fieldErrors.classId !== undefined}
              />
            </Field>
          )}

          <Field
            id="matricula-inicio"
            label="Início da vigência"
            hint="Em branco, a API grava a data de hoje."
            error={fieldErrors.startDate}
          >
            <DatePicker
              id="matricula-inicio"
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
