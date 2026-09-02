'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateReportInput } from '../schemas/report-form';
import type { ReportDetailOutput } from '../types';

export const updateReport = (reportId: string, input: UpdateReportInput) =>
  clientApi.patch<ReportDetailOutput>(`/reports/${reportId}`, input);
