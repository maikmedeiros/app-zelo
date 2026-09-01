'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { ClassOutput } from '../types';

export type FindListClassesParams = { page?: number; limit?: number; schoolYearId?: string };

export const useFindListClasses = (params: FindListClassesParams = { limit: 100 }) =>
  useQuery({
    queryKey: queryKeys.classes.list(params),
    queryFn: () => clientApi.get<Paginated<ClassOutput>>('/classes', { params }),
  });
