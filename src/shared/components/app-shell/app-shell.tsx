import Link from 'next/link';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { ptBR } from '@/shared/i18n/pt-BR';
import { MobileNav } from './mobile-nav';
import { SideNav } from './side-nav';
import { UserMenu } from './user-menu';
import type { ThemeChoice } from './theme-toggle';

const THEME_COOKIE = 'zelo-theme';

export async function AppShell({ children }: { children: ReactNode }) {
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const theme: ThemeChoice = stored === 'dark' || stored === 'light' ? stored : 'system';

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2"
      >
        {ptBR.common.skipToContent}
      </a>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-2">
        <Link href="/" className="flex items-center text-lg font-semibold text-brand">
          {ptBR.app.name}
        </Link>

        <UserMenu theme={theme} />
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-border p-4 lg:block">
          <SideNav />
        </aside>

        <main id="conteudo" className="flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
