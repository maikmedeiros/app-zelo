import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { ReportTemplateDetailOutput } from '../types';

export const findReportTemplateById = (templateId: string) =>
  serverApi.get<ReportTemplateDetailOutput>(`/report-templates/${templateId}`);
