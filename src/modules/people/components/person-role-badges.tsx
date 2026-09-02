import { Badge } from '@/shared/components/badge';
import type { PersonOutput } from '../types';
import { hasNoRole } from '../types';

const LABELS = {
  student: 'Aluno',
  guardian: 'Responsável',
  teacher: 'Professor',
} as const;

export function PersonRoleBadges({ person }: { person: PersonOutput }) {
  if (hasNoRole(person)) return <Badge tone="accent">Sem papel</Badge>;

  return (
    <span className="flex flex-wrap gap-1.5">
      {(Object.keys(LABELS) as (keyof typeof LABELS)[])
        .filter((role) => person.roles[role])
        .map((role) => (
          <Badge key={role} tone="brand">
            {LABELS[role]}
          </Badge>
        ))}
    </span>
  );
}
