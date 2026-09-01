'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListPeopleParams, PersonOutput } from '../types';

export const useFindListPeople = (params: FindListPeopleParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.people.list(params),
    queryFn: () => clientApi.get<Paginated<PersonOutput>>('/people', { params }),
    enabled,
  });
