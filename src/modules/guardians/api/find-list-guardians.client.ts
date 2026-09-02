'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListGuardiansParams } from '../schemas/find-list-guardians';
import type { GuardianOutput } from '../types';

export const useFindListGuardians = (params: Partial<FindListGuardiansParams>) =>
  useQuery({
    queryKey: queryKeys.guardians.list(params),
    queryFn: () => clientApi.get<Paginated<GuardianOutput>>('/guardians', { params }),
  });
