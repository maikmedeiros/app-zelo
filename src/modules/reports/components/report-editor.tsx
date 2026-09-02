'use client';

import { useRouter } from 'next/navigation';
import { Check, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isApiError } from '@/shared/api/errors';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { DatePicker } from '@/shared/components/date-picker';
import { Field } from '@/shared/components/field';
import { LevelPicker } from '@/shared/components/level-picker';
import { Textarea } from '@/shared/components/textarea';
import { ptBR } from '@/shared/i18n/pt-BR';
import { updateReport } from '../api/update-report.client';
import type { UpdateReportInput } from '../schemas/report-form';
import {
  REPORT_DIMENSIONS,
  type ReportDetailOutput,
  type ReportDimension,
  type ReportLevel,
} from '../types';

const AUTOSAVE_DELAY = 1200;

interface DraftItem {
  level: ReportLevel;
  note: string;
}

interface Draft {
  periodStart: string;
  periodEnd: string;
  synthesis: string;
  items: Record<ReportDimension, DraftItem>;
}

const toDraft = (report: ReportDetailOutput): Draft => ({
  periodStart: report.periodStart,
  periodEnd: report.periodEnd,
  synthesis: report.synthesis ?? '',
  items: Object.fromEntries(
    REPORT_DIMENSIONS.map((dimension) => {
      const item = report.items.find((candidate) => candidate.dimension === dimension);
      return [dimension, { level: item?.level ?? 'NAO_OBSERVADO', note: item?.note ?? '' }];
    }),
  ) as Record<ReportDimension, DraftItem>,
});

const buildPatch = (draft: Draft, saved: Draft): UpdateReportInput | null => {
  const patch: Record<string, unknown> = {};

  if (draft.periodStart !== saved.periodStart) patch.periodStart = draft.periodStart;
  if (draft.periodEnd !== saved.periodEnd) patch.periodEnd = draft.periodEnd;
  if (draft.synthesis !== saved.synthesis) {
    patch.synthesis = draft.synthesis.trim() === '' ? null : draft.synthesis;
  }

  const changed = REPORT_DIMENSIONS.filter(
    (dimension) =>
      draft.items[dimension].level !== saved.items[dimension].level ||
      draft.items[dimension].note !== saved.items[dimension].note,
  );

  if (changed.length > 0) {
    patch.items = changed.map((dimension) => ({
      dimension,
      level: draft.items[dimension].level,
      note: draft.items[dimension].note.trim() === '' ? null : draft.items[dimension].note,
    }));
  }

  return Object.keys(patch).length === 0 ? null : (patch as UpdateReportInput);
};

type SaveState =
  { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string };

function SaveIndicator({ state }: { state: SaveState }) {
  if (state.kind === 'idle') {
    return <p className="text-sm text-text-muted">As alterações se salvam sozinhas no rascunho.</p>;
  }

  if (state.kind === 'saving') {
    return (
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <LoaderCircle aria-hidden className="size-4 animate-spin" />
        Salvando…
      </p>
    );
  }

  if (state.kind === 'saved') {
    return (
      <p aria-live="polite" className="flex items-center gap-2 text-sm text-success">
        <Check aria-hidden className="size-4" />
        Rascunho salvo
      </p>
    );
  }

  return (
    <p role="alert" className="flex items-center gap-2 text-sm text-danger">
      <TriangleAlert aria-hidden className="size-4" />
      {state.message}
    </p>
  );
}

export function ReportEditor({ report }: { report: ReportDetailOutput }) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => toDraft(report));
  const [state, setState] = useState<SaveState>({ kind: 'idle' });
  const savedRef = useRef(toDraft(report));

  const save = useCallback(
    async (next: Draft) => {
      const patch = buildPatch(next, savedRef.current);
      if (patch === null) return;

      setState({ kind: 'saving' });

      try {
        await updateReport(report.id, patch);
        savedRef.current = next;
        setState({ kind: 'saved' });
        router.refresh();
      } catch (error) {
        setState({
          kind: 'error',
          message: isApiError(error) ? error.message : 'Não foi possível salvar agora.',
        });
      }
    },
    [report.id, router],
  );

  useEffect(() => {
    if (buildPatch(draft, savedRef.current) === null) return;

    const timer = setTimeout(() => void save(draft), AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [draft, save]);

  const setItem = (dimension: ReportDimension, patch: Partial<DraftItem>) =>
    setDraft((current) => ({
      ...current,
      items: { ...current.items, [dimension]: { ...current.items[dimension], ...patch } },
    }));

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-10 -mx-1 bg-surface px-1 py-2">
        <SaveIndicator state={state} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Período</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="periodo-inicio" label="Início">
            <DatePicker
              id="periodo-inicio"
              value={draft.periodStart}
              onChange={(event) =>
                setDraft((current) => ({ ...current, periodStart: event.target.value }))
              }
            />
          </Field>

          <Field id="periodo-fim" label="Fim">
            <DatePicker
              id="periodo-fim"
              value={draft.periodEnd}
              onChange={(event) =>
                setDraft((current) => ({ ...current, periodEnd: event.target.value }))
              }
            />
          </Field>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">As sete dimensões</h2>

        {REPORT_DIMENSIONS.map((dimension) => (
          <Card key={dimension}>
            <CardContent className="flex flex-col gap-4">
              <LevelPicker
                name={`nivel-${dimension}`}
                legend={ptBR.enums.reportDimension[dimension]}
                value={draft.items[dimension].level}
                onValueChange={(level) => setItem(dimension, { level })}
              />

              <Field
                id={`observacao-${dimension}`}
                label="Observação"
                hint="O que a família precisa ler para entender o nível acima."
              >
                <Textarea
                  id={`observacao-${dimension}`}
                  rows={3}
                  maxLength={2000}
                  value={draft.items[dimension].note}
                  onChange={(event) => setItem(dimension, { note: event.target.value })}
                />
              </Field>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Síntese</CardTitle>
        </CardHeader>
        <CardContent>
          <Field
            id="sintese"
            label="Fechamento do período"
            hint="É o texto que a família lê primeiro. Sem síntese e sem nenhuma dimensão observada, o relatório não publica."
          >
            <Textarea
              id="sintese"
              rows={6}
              maxLength={5000}
              value={draft.synthesis}
              onChange={(event) =>
                setDraft((current) => ({ ...current, synthesis: event.target.value }))
              }
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
