import Link from 'next/link';
import { Lock } from 'lucide-react';
import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import type { RoleOutput } from '../types';

const columns: Column<RoleOutput>[] = [
  {
    key: 'name',
    header: 'Perfil',
    cell: (role) => (
      <Link href={`/roles/${role.id}`} className="font-medium underline-offset-4 hover:underline">
        {role.name}
      </Link>
    ),
  },
  {
    key: 'code',
    header: 'Código',
    cell: (role) => <code className="text-sm">{role.code}</code>,
  },
  {
    key: 'origin',
    header: 'Origem',
    cell: (role) =>
      role.system ? (
        <Badge tone="brand">
          <Lock aria-hidden className="size-3" />
          De sistema
        </Badge>
      ) : (
        <Badge>Criado na escola</Badge>
      ),
  },
  {
    key: 'permissions',
    header: 'Permissões',
    align: 'right',
    cell: (role) => role.permissions.length,
  },
  {
    key: 'users',
    header: 'Contas',
    align: 'right',
    cell: (role) => role.userCount,
  },
];

export function RoleTable({ roles }: { roles: Paginated<RoleOutput> }) {
  return (
    <DataTable
      data={roles}
      columns={columns}
      rowKey={(role) => role.id}
      emptyTitle="Nenhum perfil encontrado"
      emptyDescription="O perfil é o conjunto de permissões que uma conta recebe por concessão."
    />
  );
}
