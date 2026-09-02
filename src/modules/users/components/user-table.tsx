import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import type { UserAccountOutput } from '../types';

const lastAccess = (iso: string | null): string =>
  iso === null
    ? 'Nunca acessou'
    : new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const columns: Column<UserAccountOutput>[] = [
  {
    key: 'personName',
    header: 'Conta',
    cell: (user) => (
      <span className="flex items-center gap-3">
        <Avatar name={user.personName} personId={user.personId} size="sm" />
        <span className="flex flex-col">
          <Link
            href={`/users/${user.id}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            {user.personName}
          </Link>
          <span className="text-sm text-text-muted">{user.email}</span>
        </span>
      </span>
    ),
  },
  {
    key: 'profiles',
    header: 'Perfis',
    cell: (user) =>
      user.profiles.length === 0 ? (
        <Badge tone="accent">Sem perfil</Badge>
      ) : (
        <span className="flex flex-wrap gap-1.5">
          {user.profiles.map((profile) => (
            <Badge key={profile} tone="brand">
              {profile}
            </Badge>
          ))}
        </span>
      ),
  },
  { key: 'lastAccessAt', header: 'Último acesso', cell: (user) => lastAccess(user.lastAccessAt) },
  {
    key: 'active',
    header: 'Situação',
    cell: (user) =>
      user.active ? <Badge tone="success">Ativa</Badge> : <Badge tone="danger">Desativada</Badge>,
  },
];

export function UserTable({ users }: { users: Paginated<UserAccountOutput> }) {
  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey={(user) => user.id}
      emptyTitle="Nenhuma conta encontrada"
      emptyDescription="Ajuste a busca ou crie o login para uma pessoa já cadastrada."
    />
  );
}
