import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import { EndClassAccessButton } from './end-class-access-button';
import { isCurrent, type ClassAccessOutput } from '../types';

const columns: Column<ClassAccessOutput>[] = [
  {
    key: 'user',
    header: 'Conta',
    cell: (access) => (
      <Link
        href={`/users/${access.userId}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {access.userName}
      </Link>
    ),
  },
  {
    key: 'class',
    header: 'Turma',
    cell: (access) => (
      <Link href={`/classes/${access.classId}`} className="underline-offset-4 hover:underline">
        {access.className}
      </Link>
    ),
  },
  {
    key: 'reason',
    header: 'Motivo',
    cell: (access) => (
      <span className="flex flex-col gap-1">
        <Badge tone="brand" className="self-start">
          {ptBR.enums.accessReason[access.reason]}
        </Badge>
        {access.justification !== null && (
          <span className="text-sm text-text-muted">{access.justification}</span>
        )}
      </span>
    ),
  },
  {
    key: 'grantedBy',
    header: 'Concedido por',
    cell: (access) => (
      <span className="flex flex-col">
        {access.grantedByName}
        <span className="text-sm text-text-muted">em {formatDate(access.startDate)}</span>
      </span>
    ),
  },
  {
    key: 'validity',
    header: 'Vigência',
    cell: (access) =>
      isCurrent(access) ? (
        <Badge tone="success">Vigente</Badge>
      ) : (
        <Badge>Encerrado em {formatDate(access.endDate ?? '')}</Badge>
      ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (access) => <EndClassAccessButton access={access} />,
  },
];

export function ClassAccessTable({ accesses }: { accesses: Paginated<ClassAccessOutput> }) {
  return (
    <DataTable
      data={accesses}
      columns={columns}
      rowKey={(access) => access.id}
      rowClassName={(access) => (isCurrent(access) ? undefined : 'text-text-muted')}
      emptyTitle="Nenhum acesso concedido"
      emptyDescription="Direção, coordenação e secretaria chegam à turma por aqui — professor chega pelo vínculo."
    />
  );
}
