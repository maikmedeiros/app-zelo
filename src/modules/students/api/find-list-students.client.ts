'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListStudentsParams } from '../schemas/find-list-students';
import type { StudentOutput } from '../types';

export const useFindListStudents = (
  params: Partial<FindListStudentsParams>,
  initialData?: Paginated<StudentOutput>,
) =>
  useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: () => clientApi.get<Paginated<StudentOutput>>('/students', { params }),
    initialData,
  });
