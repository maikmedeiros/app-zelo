'use client';

import { clientApi } from '@/shared/api/client';

export const deleteStudent = (studentId: string) => clientApi.delete(`/students/${studentId}`);
