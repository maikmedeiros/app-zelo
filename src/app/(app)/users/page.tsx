import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListRoles } from '@/modules/roles/api/find-list-roles';
import { findListUsers } from '@/modules/users/api/find-list-users';
import { NewUserButton } from '@/modules/users/components/new-user-button';
import { UserFilters } from '@/modules/users/components/user-filters';
import { UserTable } from '@/modules/users/components/user-table';
import { findListUsersSchema } from '@/modules/users/schemas/find-list-users';

export const metadata: Metadata = { title: 'Contas de acesso' };

export default async function UsersPage({ searchParams }: PageProps<'/users'>) {
  const params = parseSearchParams(findListUsersSchema, await searchParams);
  const session = await requireCapability(Feature.UserView);

  const [users, roles] = await Promise.all([
    findListUsers(params),
    hasCapability(session, Feature.RoleView) ? findListRoles() : null,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Contas de acesso"
        description="O login é de uma pessoa. Quem pode o quê depende do perfil concedido, não da conta."
        actions={hasCapability(session, Feature.UserCreate) ? <NewUserButton /> : undefined}
      />

      <UserFilters profiles={(roles?.results ?? []).map((role) => role.code)} />

      <UserTable users={users} />
    </div>
  );
}
