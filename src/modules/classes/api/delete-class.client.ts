'use client';

import { clientApi } from '@/shared/api/client';

export const deleteClass = (classId: string) => clientApi.delete(`/classes/${classId}`);
