'use client';

import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Select } from '@/shared/components/select';
import { useFindListReportTemplates } from '../api/find-list-report-templates.client';

const NONE = 'nenhum';

export function ReportTemplatePicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string | null;
  onChange: (templateId: string | null) => void;
}) {
  const canView = useCan(Feature.ReportTemplateView);
  const templates = useFindListReportTemplates({ limit: 100 }, canView);

  if (!canView) return null;

  return (
    <Select
      id={id}
      value={value ?? NONE}
      onValueChange={(next) => onChange(next === NONE ? null : next)}
      options={[
        { value: NONE, label: 'Começar em branco' },
        ...(templates.data?.results ?? []).map((template) => ({
          value: template.id,
          label: `${template.name} · ${template.itemCount} dimensões`,
        })),
      ]}
    />
  );
}
