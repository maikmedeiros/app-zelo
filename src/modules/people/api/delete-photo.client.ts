'use client';

import { clientApi } from '@/shared/api/client';

export const deletePhoto = (personId: string) => clientApi.delete(`/people/${personId}/photo`);
