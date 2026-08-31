'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { ptBR } from '@/shared/i18n/pt-BR';
import { cn } from '@/shared/utils/cn';
import { Sheet, SheetContent, SheetTrigger } from '../sheet';
import { isActive } from './nav-links';
import { SideNav } from './side-nav';
import { usePrimaryNavigation } from './use-visible-navigation';

export function MobileNav() {
  const pathname = usePathname();
  const primary = usePrimaryNavigation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Navegação"
      className="sticky bottom-0 z-30 flex border-t border-border bg-surface lg:hidden"
    >
      {primary.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs',
              active ? 'text-brand' : 'text-text-muted',
            )}
          >
            <Icon aria-hidden className="size-5" />
            {item.label}
          </Link>
        );
      })}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs text-text-muted">
          <Menu aria-hidden className="size-5" />
          {ptBR.common.openMenu}
        </SheetTrigger>

        <SheetContent title="Navegação" side="left">
          <SideNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
