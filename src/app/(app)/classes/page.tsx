import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListClasses } from '@/modules/classes/api/find-list-classes';
import { ClassFilters } from '@/modules/classes/components/class-filters';
import { ClassTable } from '@/modules/classes/components/class-table';
import { NewClassButton } from '@/modules/classes/components/new-class-button';
import { findListClassesSchema } from '@/modules/classes/schemas/find-list-classes';

export const metadata: Metadata = { title: 'Turmas' };

export default async function ClassesPage({ searchParams }: PageProps<'/classes'>) {
  const params = parseSearchParams(findListClassesSchema, await searchParams);
  const session = await requireCapability(Feature.ClassView);

  const classes = await findListClasses(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Turmas"
        description="Cada turma vive dentro de um ano letivo e recebe alunos por matrícula."
        actions={hasCapability(session, Feature.ClassCreate) ? <NewClassButton /> : undefined}
      />

      <ClassFilters />

      <ClassTable classes={classes} />
    </div>
  );
}
