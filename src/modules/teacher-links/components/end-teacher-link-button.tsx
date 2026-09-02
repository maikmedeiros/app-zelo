'use client';

import { CalendarX } from 'lucide-react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { revokeTeacherLink } from '../api/revoke-teacher-link.client';
import { isCurrent, type TeacherLinkOutput } from '../types';

export function EndTeacherLinkButton({ link }: { link: TeacherLinkOutput }) {
  const { run, pending } = useApiAction();
  const canRevoke = useCan(Feature.TeacherLinkRevoke);

  if (!canRevoke || !isCurrent(link)) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={pending}>
          <CalendarX aria-hidden className="size-4" />
          Encerrar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title={`Encerrar o vínculo de ${link.teacherName}?`}
        description={`Ele deixa de publicar e de ver ${link.className}. As postagens que já fez continuam onde estão — é o vínculo encerrado que explica a autoria delas.`}
        confirmLabel="Encerrar"
        pending={pending}
        onConfirm={() =>
          void run(() => revokeTeacherLink(link.id), {
            success: 'Vínculo encerrado',
            failure: 'Não foi possível encerrar o vínculo',
          })
        }
      />
    </AlertDialog>
  );
}
