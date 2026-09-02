import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListReportTemplatesParams } from '../schemas/find-list-report-templates';
import type { ReportTemplateOutput } from '../types';

export const findListReportTemplates = (params: Partial<FindListReportTemplatesParams> = {}) =>
  serverApi.get<Paginated<ReportTemplateOutput>>('/report-templates', { params });
