import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListRoles } from '@/modules/roles/api/find-list-roles';
import { NewRoleButton } from '@/modules/roles/components/new-role-button';
import { RoleTable } from '@/modules/roles/components/role-table';
import { findListRolesSchema } from '@/modules/roles/schemas/find-list-roles';

export const metadata: Metadata = { title: 'Perfis e permissões' };

export default async function RolesPage({ searchParams }: PageProps<'/roles'>) {
  const params = parseSearchParams(findListRolesSchema, await searchParams);
  const session = await requireCapability(Feature.RoleView);

  const roles = await findListRoles(params);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title="Perfis e permissões"
        description="O perfil é o conjunto de permissões que uma conta recebe por concessão. Perfil de sistema nasce de migration e não se edita aqui."
        actions={hasCapability(session, Feature.RoleCreate) ? <NewRoleButton /> : undefined}
      />

      <RoleTable roles={roles} />
    </div>
  );
}
