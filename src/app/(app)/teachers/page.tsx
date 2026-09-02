import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListTeachers } from '@/modules/teachers/api/find-list-teachers';
import { NewTeacherButton } from '@/modules/teachers/components/teacher-buttons';
import { TeacherFilters } from '@/modules/teachers/components/teacher-filters';
import { TeacherTable } from '@/modules/teachers/components/teacher-table';
import { findListTeachersSchema } from '@/modules/teachers/schemas/find-list-teachers';

export const metadata: Metadata = { title: 'Professores' };

export default async function TeachersPage({ searchParams }: PageProps<'/teachers'>) {
  const params = parseSearchParams(findListTeachersSchema, await searchParams);
  const session = await requireCapability(Feature.TeacherView);

  const teachers = await findListTeachers(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Professores"
        description="Quem leciona. O vínculo com cada turma é feito na tela de vínculos."
        actions={hasCapability(session, Feature.TeacherCreate) ? <NewTeacherButton /> : undefined}
      />

      <TeacherFilters />

      <TeacherTable teachers={teachers} />
    </div>
  );
}
