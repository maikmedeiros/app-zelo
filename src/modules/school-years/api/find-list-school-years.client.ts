'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListSchoolYearsParams, SchoolYearOutput } from '../types';

export const useFindListSchoolYears = (params: FindListSchoolYearsParams = { limit: 100 }) =>
  useQuery({
    queryKey: queryKeys.schoolYears.list(params),
    queryFn: () => clientApi.get<Paginated<SchoolYearOutput>>('/school-years', { params }),
  });
