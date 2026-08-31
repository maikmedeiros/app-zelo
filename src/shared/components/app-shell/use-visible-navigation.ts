'use client';

import { useMemo } from 'react';
import { NAVIGATION, type NavGroup, type NavItem } from '@/config/navigation';
import { hasCapability } from '@/shared/auth/capabilities';
import { useSession } from '@/shared/auth/session-context';

export const useVisibleNavigation = (): NavGroup[] => {
  const session = useSession();

  return useMemo(
    () =>
      NAVIGATION.map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => item.feature === undefined || hasCapability(session, item.feature),
        ),
      })).filter((group) => group.items.length > 0),
    [session],
  );
};

export const usePrimaryNavigation = (): NavItem[] =>
  useVisibleNavigation()
    .flatMap((group) => group.items)
    .filter((item) => item.primary === true)
    .slice(0, 3);
