import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatCpf } from '@/shared/utils/cpf';
import { formatPhone } from '@/shared/utils/phone';
import type { GuardianOutput } from '../types';

const columns: Column<GuardianOutput>[] = [
  {
    key: 'personName',
    header: 'Responsável',
    cell: (guardian) => (
      <span className="flex items-center gap-3">
        <Avatar name={guardian.personName} personId={guardian.personId} size="sm" />
        <Link
          href={`/guardians/${guardian.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {guardian.personName}
        </Link>
      </span>
    ),
  },
  {
    key: 'cpf',
    header: 'CPF',
    cell: (guardian) => (guardian.cpf === null ? '—' : formatCpf(guardian.cpf)),
  },
  {
    key: 'contact',
    header: 'Contato',
    cell: (guardian) =>
      guardian.contactEmail ?? (guardian.phone === null ? '—' : formatPhone(guardian.phone)),
  },
  {
    key: 'notifications',
    header: 'Avisos',
    cell: (guardian) => (
      <span className="flex flex-wrap gap-1.5">
        {guardian.receiveEmail && <Badge tone="brand">E-mail</Badge>}
        {guardian.receivePush && <Badge tone="brand">Notificação</Badge>}
        {!guardian.receiveEmail && !guardian.receivePush && <Badge>Nenhum</Badge>}
      </span>
    ),
  },
  {
    key: 'studentCount',
    header: 'Crianças',
    align: 'right',
    cell: (guardian) => guardian.studentCount,
  },
];

export function GuardianTable({ guardians }: { guardians: Paginated<GuardianOutput> }) {
  return (
    <DataTable
      data={guardians}
      columns={columns}
      rowKey={(guardian) => guardian.id}
      emptyTitle="Nenhum responsável encontrado"
      emptyDescription="Ajuste a busca ou cadastre a pessoa antes de dar a ela o papel de responsável."
    />
  );
}
