'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListTeachersParams } from '../schemas/find-list-teachers';
import type { TeacherOutput } from '../types';

export const useFindListTeachers = (params: Partial<FindListTeachersParams>) =>
  useQuery({
    queryKey: queryKeys.teachers.list(params),
    queryFn: () => clientApi.get<Paginated<TeacherOutput>>('/teachers', { params }),
  });
