'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListReportTemplatesParams } from '../schemas/find-list-report-templates';
import type { ReportTemplateOutput } from '../types';

export const useFindListReportTemplates = (
  params: Partial<FindListReportTemplatesParams>,
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.reportTemplates.list(params),
    queryFn: () => clientApi.get<Paginated<ReportTemplateOutput>>('/report-templates', { params }),
    enabled,
  });
