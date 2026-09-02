import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListReportTemplates } from '@/modules/report-templates/api/find-list-report-templates';
import { NewReportTemplateButton } from '@/modules/report-templates/components/new-report-template-button';
import { ReportTemplateFilters } from '@/modules/report-templates/components/report-template-filters';
import { ReportTemplateTable } from '@/modules/report-templates/components/report-template-table';
import { findListReportTemplatesSchema } from '@/modules/report-templates/schemas/find-list-report-templates';

export const metadata: Metadata = { title: 'Modelos de relatório' };

export default async function ReportTemplatesPage({
  searchParams,
}: PageProps<'/report-templates'>) {
  const params = parseSearchParams(findListReportTemplatesSchema, await searchParams);
  const session = await requireCapability(Feature.ReportTemplateView);

  const templates = await findListReportTemplates(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Modelos de relatório"
        description="O que se repete de uma criança para outra, escrito uma vez só. O relatório parte daqui e segue seu caminho."
        actions={
          hasCapability(session, Feature.ReportTemplateCreate) ? (
            <NewReportTemplateButton />
          ) : undefined
        }
      />

      <ReportTemplateFilters />

      <ReportTemplateTable templates={templates} />
    </div>
  );
}
