'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Feature } from '@/config/features';
import { hasCapability } from '@/shared/auth/capabilities';
import { useSession } from '@/shared/auth/session-context';
import { cn } from '@/shared/utils/cn';

const TABS = [
  { segment: null, path: '', label: 'Alunos', feature: Feature.StudentView },
  {
    segment: 'teachers',
    path: '/teachers',
    label: 'Professores',
    feature: Feature.TeacherLinkView,
  },
  { segment: 'posts', path: '/posts', label: 'Postagens', feature: Feature.PostView },
  { segment: 'consents', path: '/consents', label: 'Consentimentos', feature: Feature.ConsentView },
] as const;

export function ClassTabs({ classId }: { classId: string }) {
  const session = useSession();
  const active = useSelectedLayoutSegment();

  const visible = TABS.filter((tab) => hasCapability(session, tab.feature));

  if (visible.length <= 1) return null;

  return (
    <nav aria-label="Seções da turma" className="flex gap-1 overflow-x-auto border-b border-border">
      {visible.map((tab) => {
        const current = tab.segment === active;

        return (
          <Link
            key={tab.label}
            href={`/classes/${classId}${tab.path}`}
            aria-current={current ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center whitespace-nowrap border-b-2 px-3 text-sm font-medium',
              current
                ? 'border-brand text-brand'
                : 'border-transparent text-text-muted hover:text-text',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
