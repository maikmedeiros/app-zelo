'use client';

import { ACCOUNT_ITEM } from '@/config/navigation';
import { NavLink } from './nav-links';
import { useVisibleNavigation } from './use-visible-navigation';

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const groups = useVisibleNavigation();

  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 text-xs font-medium uppercase tracking-wide text-text-muted">
            {group.label}
          </p>
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      ))}

      <div className="flex flex-col gap-1 border-t border-border pt-4">
        <NavLink item={ACCOUNT_ITEM} onNavigate={onNavigate} />
      </div>
    </nav>
  );
}
