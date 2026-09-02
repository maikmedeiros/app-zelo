'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateReportInput } from '../schemas/report-form';
import type { ReportDetailOutput } from '../types';

export const createReport = (input: CreateReportInput) =>
  clientApi.post<ReportDetailOutput>('/reports', input);
