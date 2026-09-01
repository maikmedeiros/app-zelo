'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const ALL = 'todos';

export const useUrlFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback((key: string): string | null => searchParams.get(key), [searchParams]);

  const set = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value === null || value === ALL) params.delete(key);
      else params.set(key, value);

      params.delete('page');

      const query = params.toString();
      router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return { get, set };
};
