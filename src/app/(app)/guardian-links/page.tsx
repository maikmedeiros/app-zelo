import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListGuardianLinks } from '@/modules/guardian-links/api/find-list-guardian-links';
import { GuardianLinkFilters } from '@/modules/guardian-links/components/guardian-link-filters';
import { GuardianLinkTable } from '@/modules/guardian-links/components/guardian-link-table';
import { NewGuardianLinkButton } from '@/modules/guardian-links/components/new-guardian-link-button';
import { findListGuardianLinksSchema } from '@/modules/guardian-links/schemas/find-list-guardian-links';

export const metadata: Metadata = { title: 'Responsável e aluno' };

export default async function GuardianLinksPage({ searchParams }: PageProps<'/guardian-links'>) {
  const params = parseSearchParams(findListGuardianLinksSchema, await searchParams);
  const session = await requireCapability(Feature.GuardianLinkView);

  const links = await findListGuardianLinks(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Responsável e aluno"
        description="Quem responde por qual criança. Trocar o responsável ou a criança não é editar: é encerrar este vínculo e criar outro."
        actions={
          hasCapability(session, Feature.GuardianLinkCreate) ? <NewGuardianLinkButton /> : undefined
        }
      />

      <GuardianLinkFilters />

      <GuardianLinkTable links={links} />
    </div>
  );
}
