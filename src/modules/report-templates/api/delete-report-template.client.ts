'use client';

import { clientApi } from '@/shared/api/client';

export const deleteReportTemplate = (templateId: string) =>
  clientApi.delete(`/report-templates/${templateId}`);
