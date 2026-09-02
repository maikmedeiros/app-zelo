import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/date';
import { RevokeRoleGrantButton } from './revoke-role-grant-button';
import { isCurrent, type RoleGrantOutput } from '../types';

const columns: Column<RoleGrantOutput>[] = [
  {
    key: 'user',
    header: 'Conta',
    cell: (grant) => (
      <Link
        href={`/users/${grant.userId}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {grant.userName}
      </Link>
    ),
  },
  {
    key: 'role',
    header: 'Perfil',
    cell: (grant) => (
      <Link href={`/roles/${grant.roleId}`} className="underline-offset-4 hover:underline">
        {grant.roleName}
      </Link>
    ),
  },
  {
    key: 'validity',
    header: 'Vigência',
    cell: (grant) =>
      isCurrent(grant) ? (
        <Badge tone="success">Desde {formatDate(grant.startDate)}</Badge>
      ) : (
        <Badge>Encerrada em {formatDate(grant.endDate ?? '')}</Badge>
      ),
  },
  {
    key: 'grantedBy',
    header: 'Concedido por',
    cell: (grant) => grant.grantedByName ?? '—',
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (grant) => <RevokeRoleGrantButton grant={grant} />,
  },
];

export function RoleGrantTable({ grants }: { grants: Paginated<RoleGrantOutput> }) {
  return (
    <DataTable
      data={grants}
      columns={columns}
      rowKey={(grant) => grant.id}
      rowClassName={(grant) => (isCurrent(grant) ? undefined : 'text-text-muted')}
      emptyTitle="Nenhuma concessão encontrada"
      emptyDescription="É a concessão que liga a conta ao perfil. Sem ela, a conta entra e não vê nada."
    />
  );
}
