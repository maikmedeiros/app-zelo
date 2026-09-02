import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { getClassById } from '@/modules/classes/api/get-class-by-id';
import { orNotFound } from '@/shared/api/not-found';
import { requireCapability } from '@/shared/auth/require-capability';
import { consentStateOf } from '@/shared/components/consent-badge';
import { findListClassConsents } from '@/modules/classes/api/find-list-class-consents';
import { ClassConsentCounters } from '@/modules/classes/components/class-consent-counters';
import { ClassConsentFilters } from '@/modules/classes/components/class-consent-filters';
import { ClassConsentTable } from '@/modules/classes/components/class-consent-table';
import { CONSENT_TYPES, type ConsentType } from '@/modules/students/types';
import type { StudentConsentStatusOutput } from '@/modules/classes/types';

export const generateMetadata = async ({
  params,
}: PageProps<'/classes/[classId]/consents'>): Promise<Metadata> => {
  const { classId } = await params;
  const turma = await getClassById(classId);

  return { title: `Consentimentos · ${turma.name}` };
};

const isConsentType = (value: unknown): value is ConsentType =>
  CONSENT_TYPES.includes(value as ConsentType);

const lacksConsent = (row: StudentConsentStatusOutput, type: ConsentType): boolean =>
  consentStateOf(row.consents.find((consent) => consent.type === type)?.granted) !== 'granted';

export default async function ClassConsentsPage({
  params,
  searchParams,
}: PageProps<'/classes/[classId]/consents'>) {
  const { classId } = await params;
  const { missing } = await searchParams;

  await requireCapability(Feature.ConsentView);

  // TODO: paginar quando a turma passar de 100 alunos — os contadores e o filtro leem a lista inteira
  const consents = await orNotFound(findListClassConsents(classId, { limit: 100 }));

  const missingType = isConsentType(missing) ? missing : null;
  const rows =
    missingType === null
      ? consents.results
      : consents.results.filter((row) => lacksConsent(row, missingType));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-muted">
        O que a escola pode fazer com a imagem de cada criança, hoje. Sem registro vigente, a
        resposta é não.
      </p>

      <ClassConsentCounters rows={consents.results} />

      <ClassConsentFilters />

      <ClassConsentTable
        consents={{
          results: rows,
          page: 1,
          limit: rows.length,
          totalResults: rows.length,
          totalPages: 1,
        }}
      />
    </div>
  );
}
