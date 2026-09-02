import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListGuardians } from '@/modules/guardians/api/find-list-guardians';
import { GuardianFilters } from '@/modules/guardians/components/guardian-filters';
import { GuardianTable } from '@/modules/guardians/components/guardian-table';
import { NewGuardianButton } from '@/modules/guardians/components/new-guardian-button';
import { findListGuardiansSchema } from '@/modules/guardians/schemas/find-list-guardians';

export const metadata: Metadata = { title: 'Responsáveis' };

export default async function GuardiansPage({ searchParams }: PageProps<'/guardians'>) {
  const params = parseSearchParams(findListGuardiansSchema, await searchParams);
  const session = await requireCapability(Feature.GuardianView);

  const guardians = await findListGuardians(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Responsáveis"
        description="Quem responde pela criança. O vínculo com cada aluno é feito na tela de vínculos."
        actions={hasCapability(session, Feature.GuardianCreate) ? <NewGuardianButton /> : undefined}
      />

      <GuardianFilters />

      <GuardianTable guardians={guardians} />
    </div>
  );
}
