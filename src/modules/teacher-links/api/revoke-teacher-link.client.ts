'use client';

import { clientApi } from '@/shared/api/client';

export const revokeTeacherLink = (linkId: string) => clientApi.delete(`/teacher-links/${linkId}`);
