'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateReportTemplateInput } from '../schemas/report-template-form';
import type { ReportTemplateDetailOutput } from '../types';

export const createReportTemplate = (input: CreateReportTemplateInput) =>
  clientApi.post<ReportTemplateDetailOutput>('/report-templates', input);
