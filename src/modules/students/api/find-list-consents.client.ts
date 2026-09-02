'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import type { ConsentOutput } from '../types';

export const useFindListCurrentConsents = (studentId: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.students.consents(studentId),
    queryFn: () =>
      clientApi.get<Paginated<ConsentOutput>>(`/students/${studentId}/consents`, {
        params: { current: true, limit: 100 },
      }),
    enabled,
  });
