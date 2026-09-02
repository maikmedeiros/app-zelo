'use client';

import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Button } from '@/shared/components/button';
import { Switch } from '@/shared/components/switch';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { updateGuardian } from '../api/update-guardian.client';
import type { GuardianOutput } from '../types';

export function NotificationPreferences({ guardian }: { guardian: GuardianOutput }) {
  const { run, pending } = useApiAction();
  const canUpdate = useCan(Feature.GuardianUpdate);

  const [receiveEmail, setReceiveEmail] = useState(guardian.receiveEmail);
  const [receivePush, setReceivePush] = useState(guardian.receivePush);

  const dirty = receiveEmail !== guardian.receiveEmail || receivePush !== guardian.receivePush;

  return (
    <div className="flex flex-col gap-3">
      <Switch
        id="pref-email"
        label="Recebe aviso por e-mail"
        checked={receiveEmail}
        disabled={!canUpdate || pending}
        onCheckedChange={setReceiveEmail}
      />
      <Switch
        id="pref-push"
        label="Recebe aviso por notificação"
        checked={receivePush}
        disabled={!canUpdate || pending}
        onCheckedChange={setReceivePush}
      />

      {canUpdate && (
        <Button
          size="sm"
          className="self-start"
          disabled={!dirty || pending}
          onClick={() =>
            void run(() => updateGuardian(guardian.id, { receiveEmail, receivePush }), {
              success: 'Preferências salvas',
              failure: 'Não foi possível salvar as preferências',
            })
          }
        >
          {pending ? 'Salvando…' : 'Salvar preferências'}
        </Button>
      )}
    </div>
  );
}
