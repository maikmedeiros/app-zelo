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

export const consentStateOf = (granted: boolean | null | undefined): ConsentState =>
  granted === null || granted === undefined ? 'missing' : granted ? 'granted' : 'denied';

export function ConsentBadge({ type, state }: { type: ConsentType; state: ConsentState }) {
  return (
    <Badge tone={TONE[state]}>
      {ptBR.enums.consentType[type]} · {LABEL[state]}
    </Badge>
  );
}

export function ConsentStateBadge({ state }: { state: ConsentState }) {
  return <Badge tone={TONE[state]}>{LABEL[state]}</Badge>;
}
