import { ptBR } from '@/shared/i18n/pt-BR';
import { Badge } from './badge';

export type ConsentType = keyof typeof ptBR.enums.consentType;
export type ConsentState = 'granted' | 'denied' | 'missing';

const TONE = {
  granted: 'success',
  denied: 'danger',
  missing: 'accent',
} as const;

const LABEL = {
  granted: 'autorizado',
  denied: 'negado',
  missing: 'sem registro',
} as const;

export function ConsentBadge({ type, state }: { type: ConsentType; state: ConsentState }) {
  return (
    <Badge tone={TONE[state]}>
      {ptBR.enums.consentType[type]} · {LABEL[state]}
    </Badge>
  );
}
