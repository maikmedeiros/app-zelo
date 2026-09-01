'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { StudentOutput } from '../types';

export const useFindStudentById = (studentId: string | null) =>
  useQuery({
    queryKey: queryKeys.students.detail(studentId ?? ''),
    queryFn: () => clientApi.get<StudentOutput>(`/students/${studentId ?? ''}`),
    enabled: studentId !== null,
  });
