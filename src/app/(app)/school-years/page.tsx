import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListSchoolYears } from '@/modules/school-years/api/find-list-school-years';
import { NewSchoolYearButton } from '@/modules/school-years/components/new-school-year-button';
import { SchoolYearTable } from '@/modules/school-years/components/school-year-table';

export const metadata: Metadata = { title: 'Anos letivos' };

export default async function SchoolYearsPage({ searchParams }: PageProps<'/school-years'>) {
  const { page } = await searchParams;
  const session = await requireCapability(Feature.SchoolYearView);

  const schoolYears = await findListSchoolYears({
    page: Number(page) > 0 ? Number(page) : 1,
    limit: 20,
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title="Anos letivos"
        description="O intervalo em que as turmas existem. É ele que separa a Maternal I A de 2026 da de 2027."
        actions={
          hasCapability(session, Feature.SchoolYearCreate) ? <NewSchoolYearButton /> : undefined
        }
      />

      <SchoolYearTable schoolYears={schoolYears} />
    </div>
  );
}
