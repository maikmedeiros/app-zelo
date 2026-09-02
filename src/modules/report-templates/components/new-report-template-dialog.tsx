'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createReportTemplate } from '../api/create-report-template.client';
import { createReportTemplateSchema } from '../schemas/report-template-form';

export function NewReportTemplateDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (templateId: string) => void;
}) {
  const { run, pending, fieldErrors } = useApiAction();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createReportTemplateSchema.safeParse({
      name,
      ...(description.trim() === '' ? {} : { description }),
      items: [],
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(
      async () => {
        const template = await createReportTemplate(parsed.data);
        onCreated(template.id);
      },
      {
        success: 'Modelo criado',
        failure: 'Não foi possível criar o modelo',
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Novo modelo"
        description="Comece pelo nome. As dimensões e a síntese se escrevem na tela seguinte."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-modelo" disabled={pending}>
              {pending ? 'Criando…' : 'Criar modelo'}
            </Button>
          </>
        }
      >
        <form id="formulario-modelo" onSubmit={submit} noValidate className="flex flex-col gap-4">
          <Field id="modelo-nome" label="Nome" required error={fieldErrors.name ?? formError}>
            <Input
              id="modelo-nome"
              value={name}
              maxLength={100}
              aria-invalid={fieldErrors.name !== undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field
            id="modelo-descricao"
            label="Descrição"
            hint="Para que serve este modelo, e quando usá-lo."
            error={fieldErrors.description}
          >
            <Textarea
              id="modelo-descricao"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
