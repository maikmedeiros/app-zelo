'use client';

import { clientApi } from '@/shared/api/client';

export const revokeRoleGrant = (grantId: string) => clientApi.delete(`/role-grants/${grantId}`);
