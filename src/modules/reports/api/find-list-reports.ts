import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListReportsParams } from '../schemas/find-list-reports';
import type { ReportOutput } from '../types';

export const findListReports = (params: Partial<FindListReportsParams> = {}) =>
  serverApi.get<Paginated<ReportOutput>>('/reports', { params });
