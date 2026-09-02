'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { AssignRoleStep } from './assign-role-step';
import { PersonRoleBadges } from './person-role-badges';
import { displayName, hasNoRole, type PersonOutput } from '../types';

const ROLE_LINKS = [
  { role: 'student', label: 'Ver na lista de alunos', href: '/students' },
  { role: 'guardian', label: 'Ver na lista de responsáveis', href: '/guardians' },
  { role: 'teacher', label: 'Ver na lista de professores', href: '/teachers' },
] as const;

export function PersonRolesCard({ person }: { person: PersonOutput }) {
  const router = useRouter();
  const [assigning, setAssigning] = useState(false);

  if (assigning) {
    return (
      <AssignRoleStep
        person={person}
        onDone={() => {
          setAssigning(false);
          router.refresh();
        }}
      />
    );
  }

  const search = encodeURIComponent(displayName(person));

  return (
    <div className="flex flex-col gap-3">
      <PersonRoleBadges person={person} />

      {hasNoRole(person) ? (
        <>
          <p className="text-text-muted">
            Sem papel, esta pessoa não aparece em nenhuma lista de trabalho — só na busca por
            &ldquo;sem papel&rdquo;.
          </p>
          <Button size="sm" className="self-start" onClick={() => setAssigning(true)}>
            Atribuir papel
          </Button>
        </>
      ) : (
        <ul className="flex flex-col gap-1">
          {ROLE_LINKS.filter((item) => person.roles[item.role]).map((item) => (
            <li key={item.role}>
              <Link
                href={`${item.href}?search=${search}`}
                className="text-sm underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
