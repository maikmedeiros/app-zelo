'use client';

import { clientApi } from '@/shared/api/client';

export const revokeClassAccess = (accessId: string) =>
  clientApi.delete(`/class-accesses/${accessId}`);
