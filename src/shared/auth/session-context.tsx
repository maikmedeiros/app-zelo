'use client';

import { createContext, use, type ReactNode } from 'react';
import type { Feature } from '@/config/features';
import { hasCapability, scopesOf, widestScope } from './capabilities';
import type { Scope, Session } from './session';

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ session, children }: { session: Session; children: ReactNode }) {
  return <SessionContext value={session}>{children}</SessionContext>;
}

export const useSession = (): Session => {
  const session = use(SessionContext);

  if (session === null) {
    throw new Error('useSession precisa de um SessionProvider acima na árvore.');
  }

  return session;
};

export const useCan = (feature: Feature): boolean => hasCapability(useSession(), feature);

export const useScopesOf = (feature: Feature): Scope[] => scopesOf(useSession(), feature);

export const useWidestScope = (feature: Feature): Scope | null =>
  widestScope(useSession(), feature);

export function Can({
  feature,
  children,
  fallback = null,
}: {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return useCan(feature) ? children : fallback;
}
