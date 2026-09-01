'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListClassesParams } from '../schemas/find-list-classes';
import type { ClassOutput } from '../types';

export const useFindListClasses = (params: Partial<FindListClassesParams> = { limit: 100 }) =>
  useQuery({
    queryKey: queryKeys.classes.list(params),
    queryFn: () => clientApi.get<Paginated<ClassOutput>>('/classes', { params }),
  });
