'use client';

import { clientApi } from '@/shared/api/client';

export const deleteUser = (userId: string) => clientApi.delete(`/users/${userId}`);
