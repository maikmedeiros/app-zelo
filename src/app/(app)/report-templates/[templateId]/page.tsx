import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { requireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { findReportTemplateById } from '@/modules/report-templates/api/find-report-template-by-id';
import { ReportTemplateEditor } from '@/modules/report-templates/components/report-template-editor';

export const metadata: Metadata = { title: 'Modelo de relatório' };

export default async function ReportTemplatePage({
  params,
}: PageProps<'/report-templates/[templateId]'>) {
  const { templateId } = await params;
  await requireCapability(Feature.ReportTemplateView);

  const template = await orNotFound(findReportTemplateById(templateId));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={template.name}
        description={template.description ?? `Escrito por ${template.authorName}`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Modelos de relatório', href: '/report-templates' },
              { label: template.name },
            ]}
          />
        }
      />

      <ReportTemplateEditor template={template} />
    </div>
  );
}
