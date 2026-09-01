import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListStudents } from '@/modules/students/api/find-list-students';
import { NewStudentButton } from '@/modules/students/components/new-student-button';
import { StudentFilters } from '@/modules/students/components/student-filters';
import { StudentTable } from '@/modules/students/components/student-table';
import { findListStudentsSchema } from '@/modules/students/schemas/find-list-students';

export const metadata: Metadata = { title: 'Alunos' };

export default async function StudentsPage({ searchParams }: PageProps<'/students'>) {
  const params = parseSearchParams(findListStudentsSchema, await searchParams);
  const session = await requireCapability(Feature.StudentView);

  const students = await findListStudents(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Alunos"
        description="As crianças que a escola acompanha, com a turma vigente de cada uma."
        actions={hasCapability(session, Feature.StudentCreate) ? <NewStudentButton /> : undefined}
      />

      <StudentFilters />

      <StudentTable students={students} />
    </div>
  );
}
