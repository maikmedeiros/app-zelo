'use client';

import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { ConsentBadge, consentStateOf } from '@/shared/components/consent-badge';
import { useFindListCurrentConsents } from '../api/find-list-consents.client';
import type { ConsentType } from '../types';

const IMAGE_TYPES: ConsentType[] = ['IMAGEM_INTERNA', 'IMAGEM_EXTERNA'];

export function StudentConsentSeal({ studentId }: { studentId: string }) {
  const canView = useCan(Feature.ConsentView);
  const consents = useFindListCurrentConsents(studentId, canView);

  if (!canView) return null;

  if (consents.isPending) {
    return <span className="text-xs text-text-muted">Consultando consentimento…</span>;
  }

  if (consents.isError) {
    return <span className="text-xs text-text-muted">Consentimento indisponível</span>;
  }

  return (
    <span className="flex flex-wrap gap-1">
      {IMAGE_TYPES.map((type) => (
        <ConsentBadge
          key={type}
          type={type}
          state={consentStateOf(
            consents.data.results.find((consent) => consent.type === type)?.granted,
          )}
        />
      ))}
    </span>
  );
}
