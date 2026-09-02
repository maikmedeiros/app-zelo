'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListRolesParams } from '../schemas/find-list-roles';
import type { RoleOutput } from '../types';

export const useFindListRoles = (params: Partial<FindListRolesParams>, enabled = true) =>
  useQuery({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => clientApi.get<Paginated<RoleOutput>>('/roles', { params }),
    enabled,
  });
