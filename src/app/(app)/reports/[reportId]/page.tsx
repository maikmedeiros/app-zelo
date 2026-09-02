import type { Metadata } from 'next';
import { cache } from 'react';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { findReportById } from '@/modules/reports/api/find-report-by-id';
import { PrintButton } from '@/modules/reports/components/print-button';
import { ReportActions } from '@/modules/reports/components/report-actions';
import { ReportEditor } from '@/modules/reports/components/report-editor';
import { ReportReading } from '@/modules/reports/components/report-reading';
import { ReportStatusBadge } from '@/modules/reports/components/report-status-badge';
import { formatDate } from '@/shared/utils/date';
import { isPublished } from '@/modules/reports/types';

const getReportById = cache((id: string) => orNotFound(findReportById(id)));

export const generateMetadata = async ({
  params,
}: PageProps<'/reports/[reportId]'>): Promise<Metadata> => {
  const { reportId } = await params;
  const report = await getReportById(reportId);

  return { title: `Relatório de ${report.studentName}` };
};

export default async function ReportPage({ params }: PageProps<'/reports/[reportId]'>) {
  const { reportId } = await params;
  const session = await requireCapability(Feature.ReportView);

  const report = await getReportById(reportId);

  const editable = !isPublished(report) && hasCapability(session, Feature.ReportUpdate);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div data-print="hide" className="flex flex-col gap-6">
        <PageHeader
          title={`Relatório de ${report.studentName}`}
          description={`${report.className} · ${formatDate(report.periodStart)} a ${formatDate(report.periodEnd)}`}
          breadcrumbs={
            <Breadcrumbs
              items={[{ label: 'Relatórios', href: '/reports' }, { label: report.studentName }]}
            />
          }
          actions={
            <>
              <ReportStatusBadge status={report.status} />
              <PrintButton />
              <ReportActions report={report} />
            </>
          }
        />
      </div>

      {editable ? (
        <>
          <div data-print="hide">
            <ReportEditor report={report} />
          </div>

          <div className="hidden print:block">
            <ReportReading report={report} />
          </div>
        </>
      ) : (
        <ReportReading report={report} />
      )}
    </div>
  );
}
