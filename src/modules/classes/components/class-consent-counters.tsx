import { ptBR } from '@/shared/i18n/pt-BR';
import { consentStateOf, type ConsentState } from '@/shared/components/consent-badge';
import { CONSENT_TYPES, type ConsentType } from '@/modules/students/types';
import type { StudentConsentStatusOutput } from '../types';

const COUNTER_TONE: Record<ConsentState, string> = {
  granted: 'text-success',
  denied: 'text-danger',
  missing: 'text-text-muted',
};

const COUNTER_LABEL: Record<ConsentState, string> = {
  granted: 'autorizam',
  denied: 'negam',
  missing: 'sem registro',
};

const countBy = (rows: StudentConsentStatusOutput[], type: ConsentType, state: ConsentState) =>
  rows.filter(
    (row) =>
      consentStateOf(row.consents.find((consent) => consent.type === type)?.granted) === state,
  ).length;

export function ClassConsentCounters({ rows }: { rows: StudentConsentStatusOutput[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {CONSENT_TYPES.map((type) => (
        <div key={type} className="flex flex-col gap-1 rounded-card border border-border p-3">
          <dt className="text-sm font-medium">{ptBR.enums.consentType[type]}</dt>
          <dd className="flex flex-wrap gap-x-3 text-sm">
            {(['granted', 'denied', 'missing'] as const).map((state) => (
              <span key={state} className={COUNTER_TONE[state]}>
                <strong className="text-base">{countBy(rows, type, state)}</strong>{' '}
                {COUNTER_LABEL[state]}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
