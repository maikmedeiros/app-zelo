import 'server-only';
import { redirect } from 'next/navigation';
import type { Feature } from '@/config/features';
import { hasCapability } from './capabilities';
import { getCurrentSession } from './current-session';
import type { Session } from './session';

export const requireCapability = async (feature: Feature): Promise<Session> => {
  const session = await getCurrentSession();

  if (!hasCapability(session, feature)) redirect('/403');

  return session;
};
