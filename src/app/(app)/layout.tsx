import { getCurrentSession } from '@/shared/auth/current-session';
import { SessionProvider } from '@/shared/auth/session-context';

export default async function AppLayout({ children }: LayoutProps<'/'>) {
  const session = await getCurrentSession();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
