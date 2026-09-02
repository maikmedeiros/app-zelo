import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatCpf } from '@/shared/utils/cpf';
import { formatPhone } from '@/shared/utils/phone';
import { PersonRoleBadges } from './person-role-badges';
import { displayName, type PersonOutput } from '../types';

const columns: Column<PersonOutput>[] = [
  {
    key: 'name',
    header: 'Pessoa',
    cell: (person) => (
      <span className="flex items-center gap-3">
        <Avatar name={displayName(person)} personId={person.id} size="sm" />
        <Link
          href={`/people/${person.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {displayName(person)}
        </Link>
      </span>
    ),
  },
  {
    key: 'cpf',
    header: 'CPF',
    cell: (person) => (person.cpf === null ? '—' : formatCpf(person.cpf)),
  },
  {
    key: 'contact',
    header: 'Contato',
    cell: (person) =>
      person.contactEmail ?? (person.phone === null ? '—' : formatPhone(person.phone)),
  },
  { key: 'roles', header: 'Papéis', cell: (person) => <PersonRoleBadges person={person} /> },
  {
    key: 'hasUser',
    header: 'Acesso',
    cell: (person) =>
      person.hasUser ? <Badge tone="success">Tem login</Badge> : <Badge>Sem login</Badge>,
  },
];

export function PersonTable({ people }: { people: Paginated<PersonOutput> }) {
  return (
    <DataTable
      data={people}
      columns={columns}
      rowKey={(person) => person.id}
      emptyTitle="Nenhuma pessoa encontrada"
      emptyDescription="Ajuste a busca, o CPF ou o filtro de papel."
    />
  );
}
