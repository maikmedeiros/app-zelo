'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

const toPositiveInt = (value: string | null, fallback: number, max: number): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;

  return Math.min(parsed, max);
};

export const useUrlPagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = toPositiveInt(searchParams.get('page'), 1, Number.MAX_SAFE_INTEGER);
  const limit = toPositiveInt(searchParams.get('limit'), DEFAULT_LIMIT, MAX_LIMIT);

  const goTo = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams);

      if (nextPage <= 1) params.delete('page');
      else params.set('page', String(nextPage));

      const query = params.toString();
      router.push(query.length > 0 ? `${pathname}?${query}` : pathname, { scroll: true });
    },
    [pathname, router, searchParams],
  );

  return { page, limit, goTo };
};
