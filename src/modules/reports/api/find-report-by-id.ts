import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { ReportDetailOutput } from '../types';

export const findReportById = (reportId: string) =>
  serverApi.get<ReportDetailOutput>(`/reports/${reportId}`);
