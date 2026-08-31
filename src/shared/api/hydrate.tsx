import 'server-only';
import type { ReactNode } from 'react';
import { cache } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { makeQueryClient } from './query-client';

export const getServerQueryClient = cache(makeQueryClient);

export function Hydrate({ children }: { children: ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getServerQueryClient())}>{children}</HydrationBoundary>
  );
}
