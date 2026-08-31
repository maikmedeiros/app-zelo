import { QueryClient } from '@tanstack/react-query';
import { isApiError } from './errors';

export const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (isApiError(error) && error.statusCode >= 400 && error.statusCode < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: { retry: false },
    },
  });
