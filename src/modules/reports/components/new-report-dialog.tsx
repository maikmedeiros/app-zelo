'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { ReportTemplatePicker } from '@/modules/report-templates/components/report-template-picker';
import { StudentPicker } from '@/modules/students/components/student-picker';
import { createReport } from '../api/create-report.client';
import { createReportSchema } from '../schemas/report-form';

export function NewReportDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (reportId: string) => void;
}) {
  const { run, pending, fieldErrors } = useApiAction();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createReportSchema.safeParse({
      studentId,
      periodStart,
      periodEnd,
      ...(templateId === null ? {} : { templateId }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(
      async () => {
        const report = await createReport(parsed.data);
        onCreated(report.id);
      },
      {
        success: 'Rascunho criado',
        failure: 'Não foi possível criar o relatório',
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Novo relatório"
        description="Nasce rascunho: a família só vê quando você publicar."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-relatorio" disabled={pending}>
              {pending ? 'Criando…' : 'Criar rascunho'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-relatorio"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Field
            id="relatorio-aluno"
            label="Criança"
            required
            error={fieldErrors.studentId ?? formError}
          >
            <StudentPicker
              id="relatorio-aluno"
              value={studentId}
              onChange={setStudentId}
              invalid={fieldErrors.studentId !== undefined}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="relatorio-inicio"
              label="Início do período"
              required
              error={fieldErrors.periodStart}
            >
              <DatePicker
                id="relatorio-inicio"
                value={periodStart}
                aria-invalid={fieldErrors.periodStart !== undefined}
                onChange={(event) => setPeriodStart(event.target.value)}
              />
            </Field>

            <Field id="relatorio-fim" label="Fim do período" required error={fieldErrors.periodEnd}>
              <DatePicker
                id="relatorio-fim"
                value={periodEnd}
                aria-invalid={fieldErrors.periodEnd !== undefined}
                onChange={(event) => setPeriodEnd(event.target.value)}
              />
            </Field>
          </div>

          <Field
            id="relatorio-modelo"
            label="Partir de um modelo"
            hint="O modelo preenche níveis e observações de saída. Tudo continua editável depois."
            error={fieldErrors.templateId}
          >
            <ReportTemplatePicker
              id="relatorio-modelo"
              value={templateId}
              onChange={setTemplateId}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
