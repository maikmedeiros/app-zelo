import 'server-only';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Feature } from '@/config/features';
import { hasCapability } from './capabilities';
import { getCurrentSession } from './current-session';

export async function RequireCapability({
  feature,
  children,
}: {
  feature: Feature;
  children: ReactNode;
}) {
  const session = await getCurrentSession();

  if (!hasCapability(session, feature)) redirect('/403');

  return children;
}
