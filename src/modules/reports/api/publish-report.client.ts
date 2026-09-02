'use client';

import { clientApi } from '@/shared/api/client';
import type { ReportDetailOutput } from '../types';

export const publishReport = (reportId: string) =>
  clientApi.post<ReportDetailOutput>(`/reports/${reportId}/publication`);
