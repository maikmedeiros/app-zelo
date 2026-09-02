import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListClassAccesses } from '@/modules/class-accesses/api/find-list-class-accesses';
import { ClassAccessFilters } from '@/modules/class-accesses/components/class-access-filters';
import { ClassAccessTable } from '@/modules/class-accesses/components/class-access-table';
import { NewClassAccessButton } from '@/modules/class-accesses/components/new-class-access-button';
import { findListClassAccessesSchema } from '@/modules/class-accesses/schemas/find-list-class-accesses';

export const metadata: Metadata = { title: 'Acessos a turma' };

export default async function ClassAccessesPage({ searchParams }: PageProps<'/class-accesses'>) {
  const params = parseSearchParams(findListClassAccessesSchema, await searchParams);
  const session = await requireCapability(Feature.ClassAccessView);

  const accesses = await findListClassAccesses(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Acessos a turma"
        description="Decisão administrativa auditada: a trilha responde quem viu o quê, por quê e a mando de quem. Encerrar não apaga."
        actions={
          hasCapability(session, Feature.ClassAccessCreate) ? <NewClassAccessButton /> : undefined
        }
      />

      <ClassAccessFilters />

      <ClassAccessTable accesses={accesses} />
    </div>
  );
}
