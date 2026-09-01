'use client';

import { clientApi } from '@/shared/api/client';

export const revokeEnrollment = (enrollmentId: string) =>
  clientApi.delete(`/enrollments/${enrollmentId}`);
