'use client';

import { useRouter } from 'next/navigation';
import { Send, Trash2 } from 'lucide-react';
import { Feature } from '@/config/features';
import { useCan, useSession, useWidestScope } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { deleteReport } from '../api/delete-report.client';
import { publishReport } from '../api/publish-report.client';
import { hasContent, isPublished, type ReportDetailOutput } from '../types';

export function ReportActions({ report }: { report: ReportDetailOutput }) {
  const router = useRouter();
  const session = useSession();
  const { run, pending } = useApiAction();
  const canPublish = useCan(Feature.ReportPublish);
  const deleteScope = useWidestScope(Feature.ReportDelete);

  const published = isPublished(report);
  const isAuthor = report.authorId === session.id;
  const canDelete =
    deleteScope !== null && (deleteScope === 'PROPRIA' ? isAuthor : true) && !published;
  const ready = hasContent(report);

  if (published && !canDelete) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!published && canPublish && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={pending || !ready}>
              <Send aria-hidden className="size-4" />
              Publicar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            title="Publicar o relatório?"
            description="A família passa a ver esta versão. Publicado, o relatório não se altera nem se remove — para corrigir, escreva outro."
            confirmLabel="Publicar"
            confirmVariant="primary"
            pending={pending}
            onConfirm={() =>
              void run(() => publishReport(report.id), {
                success: 'Relatório publicado',
                failure: 'Não foi possível publicar',
              })
            }
          />
        </AlertDialog>
      )}

      {!published && canPublish && !ready && (
        <p className="text-sm text-text-muted">
          Falta conteúdo: escreva a síntese ou observe ao menos uma dimensão.
        </p>
      )}

      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="sm" disabled={pending}>
              <Trash2 aria-hidden className="size-4" />
              {ptBR.common.remove}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            title="Remover o rascunho?"
            description="O rascunho some para sempre. A família nunca o viu, então nada muda para ela."
            confirmLabel={ptBR.common.remove}
            pending={pending}
            onConfirm={() =>
              void run(() => deleteReport(report.id), {
                success: 'Rascunho removido',
                failure: 'Não foi possível remover',
                onSuccess: () => router.push('/reports'),
              })
            }
          />
        </AlertDialog>
      )}
    </div>
  );
}
