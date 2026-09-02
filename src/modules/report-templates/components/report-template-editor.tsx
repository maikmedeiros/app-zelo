'use client';

import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan, useSession, useWidestScope } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { LevelPicker } from '@/shared/components/level-picker';
import { Select } from '@/shared/components/select';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { REPORT_DIMENSIONS, type ReportDimension, type ReportLevel } from '@/modules/reports/types';
import { deleteReportTemplate } from '../api/delete-report-template.client';
import { updateReportTemplate } from '../api/update-report-template.client';
import { updateReportTemplateSchema } from '../schemas/report-template-form';
import type { ReportTemplateDetailOutput } from '../types';

interface DraftItem {
  dimension: ReportDimension;
  level: ReportLevel | null;
  note: string;
}

const toDraftItems = (template: ReportTemplateDetailOutput): DraftItem[] =>
  REPORT_DIMENSIONS.filter((dimension) =>
    template.items.some((item) => item.dimension === dimension),
  ).map((dimension) => {
    const item = template.items.find((candidate) => candidate.dimension === dimension);
    return { dimension, level: item?.level ?? null, note: item?.note ?? '' };
  });

export function ReportTemplateEditor({ template }: { template: ReportTemplateDetailOutput }) {
  const router = useRouter();
  const session = useSession();
  const { run, pending, fieldErrors } = useApiAction();

  const updateScope = useWidestScope(Feature.ReportTemplateUpdate);
  const deleteScope = useWidestScope(Feature.ReportTemplateDelete);
  const canView = useCan(Feature.ReportTemplateView);

  const isAuthor = template.authorId === session.id;
  const allows = (scope: typeof updateScope) =>
    scope !== null && (scope === 'PROPRIA' ? isAuthor : true);

  const editable = allows(updateScope);

  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description ?? '');
  const [synthesis, setSynthesis] = useState(template.synthesis ?? '');
  const [items, setItems] = useState<DraftItem[]>(() => toDraftItems(template));
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const available = REPORT_DIMENSIONS.filter(
    (dimension) => !items.some((item) => item.dimension === dimension),
  );

  const setItem = (dimension: ReportDimension, patch: Partial<DraftItem>) =>
    setItems((current) =>
      current.map((item) => (item.dimension === dimension ? { ...item, ...patch } : item)),
    );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = updateReportTemplateSchema.safeParse({
      name,
      description: description.trim() === '' ? null : description,
      synthesis: synthesis.trim() === '' ? null : synthesis,
      items: items.map((item) => ({
        dimension: item.dimension,
        level: item.level,
        note: item.note.trim() === '' ? null : item.note,
      })),
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const dimension = typeof issue?.path[1] === 'number' ? items[issue.path[1]]?.dimension : null;
      setFormError(
        dimension === null || dimension === undefined
          ? issue?.message
          : `${ptBR.enums.reportDimension[dimension]}: ${issue?.message}`,
      );
      return;
    }

    await run(() => updateReportTemplate(template.id, parsed.data), {
      success: 'Modelo salvo',
      failure: 'Não foi possível salvar o modelo',
    });
  };

  if (!canView) return null;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field id="modelo-nome" label="Nome" required error={fieldErrors.name}>
            <Input
              id="modelo-nome"
              value={name}
              maxLength={100}
              disabled={!editable}
              aria-invalid={fieldErrors.name !== undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field id="modelo-descricao" label="Descrição" error={fieldErrors.description}>
            <Textarea
              id="modelo-descricao"
              rows={2}
              maxLength={500}
              value={description}
              disabled={!editable}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>

          <Field
            id="modelo-sintese"
            label="Síntese de saída"
            hint="O texto que o relatório recebe pronto. Quem escreve o relatório ajusta depois."
            error={fieldErrors.synthesis}
          >
            <Textarea
              id="modelo-sintese"
              rows={4}
              maxLength={5000}
              value={synthesis}
              disabled={!editable}
              onChange={(event) => setSynthesis(event.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Dimensões do modelo</h2>

          {editable && available.length > 0 && (
            <div className="flex items-end gap-2">
              <Select
                id="modelo-nova-dimensao"
                value={undefined}
                placeholder="Adicionar dimensão"
                onValueChange={(value) =>
                  setItems((current) => [
                    ...current,
                    { dimension: value as ReportDimension, level: null, note: '' },
                  ])
                }
                options={available.map((dimension) => ({
                  value: dimension,
                  label: ptBR.enums.reportDimension[dimension],
                }))}
              />
              <Plus aria-hidden className="mb-3 size-4 text-text-muted" />
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-text-muted">
            Modelo sem dimensão nenhuma: só a síntese chega ao relatório. Adicione as dimensões que
            se repetem de uma criança para outra.
          </p>
        ) : (
          items.map((item) => (
            <Card key={item.dimension}>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <LevelPicker
                    name={`modelo-nivel-${item.dimension}`}
                    legend={ptBR.enums.reportDimension[item.dimension]}
                    value={item.level ?? undefined}
                    disabled={!editable}
                    onValueChange={(level) => setItem(item.dimension, { level })}
                  />

                  {editable && (
                    <div className="flex gap-1">
                      {item.level !== null && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setItem(item.dimension, { level: null })}
                        >
                          Limpar nível
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Remover ${ptBR.enums.reportDimension[item.dimension]}`}
                        onClick={() =>
                          setItems((current) =>
                            current.filter((candidate) => candidate.dimension !== item.dimension),
                          )
                        }
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Field
                  id={`modelo-observacao-${item.dimension}`}
                  label="Observação de saída"
                  hint="Sem nível e sem observação, a dimensão não entra no modelo."
                >
                  <Textarea
                    id={`modelo-observacao-${item.dimension}`}
                    rows={3}
                    maxLength={2000}
                    value={item.note}
                    disabled={!editable}
                    onChange={(event) => setItem(item.dimension, { note: event.target.value })}
                  />
                </Field>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {formError !== undefined && (
        <p role="alert" className="text-sm text-danger">
          {formError}
        </p>
      )}

      {(editable || allows(deleteScope)) && (
        <div data-print="hide" className="flex flex-wrap items-center gap-2">
          {editable && (
            <Button type="submit" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar modelo'}
            </Button>
          )}

          {allows(deleteScope) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="secondary" size="md" disabled={pending}>
                  <Trash2 aria-hidden className="size-4" />
                  {ptBR.common.remove}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                title="Remover o modelo?"
                description="Os relatórios já criados a partir dele não mudam — o modelo só serve de ponto de partida."
                confirmLabel={ptBR.common.remove}
                pending={pending}
                onConfirm={() =>
                  void run(() => deleteReportTemplate(template.id), {
                    success: 'Modelo removido',
                    failure: 'Não foi possível remover',
                    onSuccess: () => router.push('/report-templates'),
                  })
                }
              />
            </AlertDialog>
          )}
        </div>
      )}
    </form>
  );
}
