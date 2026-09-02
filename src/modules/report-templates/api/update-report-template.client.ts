'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateReportTemplateInput } from '../schemas/report-template-form';
import type { ReportTemplateDetailOutput } from '../types';

export const updateReportTemplate = (templateId: string, input: UpdateReportTemplateInput) =>
  clientApi.patch<ReportTemplateDetailOutput>(`/report-templates/${templateId}`, input);
