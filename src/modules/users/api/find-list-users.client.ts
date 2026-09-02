'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListUsersParams } from '../schemas/find-list-users';
import type { UserAccountOutput } from '../types';

export const useFindListUsers = (params: Partial<FindListUsersParams>) =>
  useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => clientApi.get<Paginated<UserAccountOutput>>('/users', { params }),
  });
