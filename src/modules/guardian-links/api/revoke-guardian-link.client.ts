'use client';

import { clientApi } from '@/shared/api/client';

export const revokeGuardianLink = (linkId: string) => clientApi.delete(`/guardian-links/${linkId}`);
