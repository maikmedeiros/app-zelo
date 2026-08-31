'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/config/navigation';
import { cn } from '@/shared/utils/cn';

export const isActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

export function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center gap-3 rounded-control px-3 text-sm transition-colors',
        active ? 'bg-brand-soft font-medium text-brand' : 'text-text hover:bg-surface-muted',
      )}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      {item.label}
    </Link>
  );
}
