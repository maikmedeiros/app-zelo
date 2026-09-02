'use client';

import { clientApi } from '@/shared/api/client';

export const revokeConsent = (studentId: string, consentId: string) =>
  clientApi.delete(`/students/${studentId}/consents/${consentId}`);
