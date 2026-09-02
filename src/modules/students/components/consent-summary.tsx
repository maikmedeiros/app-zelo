'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Button } from '@/shared/components/button';
import { Card, CardContent } from '@/shared/components/card';
import { ConsentStateBadge, consentStateOf } from '@/shared/components/consent-badge';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import { ConsentDialog } from './consent-dialog';
import { RevokeConsentButton } from './revoke-consent-button';
import { CONSENT_TYPES, type ConsentOutput, type ConsentType } from '../types';

export function ConsentSummary({
  studentId,
  studentName,
  current,
}: {
  studentId: string;
  studentName: string;
  current: ConsentOutput[];
}) {
  const canCreate = useCan(Feature.ConsentCreate);
  const [registering, setRegistering] = useState<ConsentType | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {CONSENT_TYPES.map((type) => {
          const consent = current.find((item) => item.type === type) ?? null;

          return (
            <Card key={type}>
              <CardContent className="flex h-full flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-medium">{ptBR.enums.consentType[type]}</h2>
                  <div className="self-start">
                    <ConsentStateBadge state={consentStateOf(consent?.granted)} />
                  </div>
                </div>

                {consent === null ? (
                  <p className="flex-1 text-sm text-text-muted">
                    Sem registro vigente. Na dúvida, a resposta é não.
                  </p>
                ) : (
                  <dl className="flex-1 text-sm text-text-muted">
                    <div className="flex gap-1">
                      <dt>Origem:</dt>
                      <dd>{ptBR.enums.consentOrigin[consent.origin]}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt>Desde:</dt>
                      <dd>{formatDate(consent.startedAt)}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt>Assinou:</dt>
                      <dd>{consent.guardianName ?? 'Sem responsável indicado'}</dd>
                    </div>
                  </dl>
                )}

                <div className="flex flex-wrap gap-2">
                  {canCreate && (
                    <Button variant="secondary" size="sm" onClick={() => setRegistering(type)}>
                      <Plus aria-hidden className="size-4" />
                      {consent === null ? 'Registrar' : 'Substituir'}
                    </Button>
                  )}

                  {consent !== null && <RevokeConsentButton consent={consent} />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {registering !== null && (
        <ConsentDialog
          studentId={studentId}
          studentName={studentName}
          initialType={registering}
          open
          onOpenChange={(open) => {
            if (!open) setRegistering(null);
          }}
        />
      )}
    </>
  );
}
