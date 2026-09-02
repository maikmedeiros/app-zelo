'use client';

import { Undo2 } from 'lucide-react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button, type ButtonVariant } from '@/shared/components/button';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { revokeConsent } from '../api/revoke-consent.client';
import type { ConsentOutput } from '../types';

export function RevokeConsentButton({
  consent,
  variant = 'ghost',
}: {
  consent: ConsentOutput;
  variant?: ButtonVariant;
}) {
  const { run, pending } = useApiAction();
  const canRevoke = useCan(Feature.ConsentRevoke);

  if (!canRevoke || !consent.current) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size="sm" disabled={pending}>
          <Undo2 aria-hidden className="size-4" />
          Revogar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title={`Revogar ${ptBR.enums.consentType[consent.type].toLowerCase()}?`}
        description="A revogação encerra a vigência de hoje em diante e entra no histórico como mais um fato datado. Ela não apaga o registro nem o que já foi publicado sob a autorização anterior."
        confirmLabel="Revogar"
        pending={pending}
        onConfirm={() =>
          void run(() => revokeConsent(consent.studentId, consent.id), {
            success: 'Consentimento revogado',
            failure: 'Não foi possível revogar',
          })
        }
      />
    </AlertDialog>
  );
}
