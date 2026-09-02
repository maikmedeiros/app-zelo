'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { FindListGuardianLinksParams } from '../schemas/find-list-guardian-links';
import type { GuardianLinkOutput } from '../types';

export const useFindListGuardianLinks = (
  params: Partial<FindListGuardianLinksParams>,
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.guardianLinks.list(params),
    queryFn: () => clientApi.get<Paginated<GuardianLinkOutput>>('/guardian-links', { params }),
    enabled,
  });
