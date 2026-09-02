import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListReports } from '@/modules/reports/api/find-list-reports';
import { NewReportButton } from '@/modules/reports/components/new-report-button';
import { ReportFilters } from '@/modules/reports/components/report-filters';
import { ReportTable } from '@/modules/reports/components/report-table';
import { findListReportsSchema } from '@/modules/reports/schemas/find-list-reports';

export const metadata: Metadata = { title: 'Relatórios' };

export default async function ReportsPage({ searchParams }: PageProps<'/reports'>) {
  const params = parseSearchParams(findListReportsSchema, await searchParams);
  const session = await requireCapability(Feature.ReportView);

  const reports = await findListReports(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Relatórios"
        description="O fechamento de um período nas sete dimensões. Enquanto é rascunho, só a escola vê."
        actions={hasCapability(session, Feature.ReportCreate) ? <NewReportButton /> : undefined}
      />

      <ReportFilters />

      <ReportTable reports={reports} />
    </div>
  );
}
