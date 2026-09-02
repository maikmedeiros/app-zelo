'use client';

import { clientApi } from '@/shared/api/client';

export const deleteReport = (reportId: string) => clientApi.delete(`/reports/${reportId}`);
