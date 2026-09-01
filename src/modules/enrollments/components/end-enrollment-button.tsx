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
import { revokeEnrollment } from '../api/revoke-enrollment.client';
import { isCurrent, type EnrollmentOutput } from '../types';

export function EndEnrollmentButton({ enrollment }: { enrollment: EnrollmentOutput }) {
  const { run, pending } = useApiAction();
  const canRevoke = useCan(Feature.EnrollmentRevoke);

  if (!canRevoke || !isCurrent(enrollment)) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={pending}>
          <CalendarX aria-hidden className="size-4" />
          Encerrar matrícula
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title={`Encerrar a matrícula de ${enrollment.studentName}?`}
        description={`A vigência em ${enrollment.className} termina hoje. Nada é apagado: a matrícula encerrada é o que explica a criança aparecer nas postagens do período.`}
        confirmLabel="Encerrar"
        pending={pending}
        onConfirm={() =>
          void run(() => revokeEnrollment(enrollment.id), {
            success: 'Matrícula encerrada',
            failure: 'Não foi possível encerrar a matrícula',
          })
        }
      />
    </AlertDialog>
  );
}
