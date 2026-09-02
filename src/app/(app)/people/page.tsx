import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListPeople } from '@/modules/people/api/find-list-people';
import { NewPersonButton } from '@/modules/people/components/new-person-button';
import { PersonFilters } from '@/modules/people/components/person-filters';
import { PersonTable } from '@/modules/people/components/person-table';
import { findListPeopleSchema } from '@/modules/people/schemas/find-list-people';

export const metadata: Metadata = { title: 'Pessoas' };

export default async function PeoplePage({ searchParams }: PageProps<'/people'>) {
  const params = parseSearchParams(findListPeopleSchema, await searchParams);
  const session = await requireCapability(Feature.PersonView);

  const people = await findListPeople(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Pessoas"
        description="Todo mundo que a escola conhece. O papel — aluno, responsável, professor — vem depois do cadastro."
        actions={hasCapability(session, Feature.PersonCreate) ? <NewPersonButton /> : undefined}
      />

      <PersonFilters />

      <PersonTable people={people} />
    </div>
  );
}
