'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { makeQueryClient } from '@/shared/api/query-client';
import { ToastProvider } from '@/shared/components/toast';

let browserQueryClient: QueryClient | undefined;

const getQueryClient = (): QueryClient => {
  if (typeof window === 'undefined') return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
