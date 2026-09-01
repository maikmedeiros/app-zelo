import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListEnrollments } from '@/modules/enrollments/api/find-list-enrollments';
import { EnrollStudentButton } from '@/modules/enrollments/components/enroll-student-button';
import { EnrollmentFilters } from '@/modules/enrollments/components/enrollment-filters';
import { EnrollmentTable } from '@/modules/enrollments/components/enrollment-table';
import { findListEnrollmentsSchema } from '@/modules/enrollments/schemas/find-list-enrollments';

export const metadata: Metadata = { title: 'Matrículas' };

export default async function EnrollmentsPage({ searchParams }: PageProps<'/enrollments'>) {
  const params = parseSearchParams(findListEnrollmentsSchema, await searchParams);
  const session = await requireCapability(Feature.EnrollmentView);

  const enrollments = await findListEnrollments(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Matrículas"
        description="A vigência que liga a criança à turma. Encerrar não apaga: é o histórico que explica o passado."
        actions={
          hasCapability(session, Feature.EnrollmentCreate) ? <EnrollStudentButton /> : undefined
        }
      />

      <EnrollmentFilters />

      <EnrollmentTable enrollments={enrollments} />
    </div>
  );
}
