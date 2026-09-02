import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { requireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { findRoleById } from '@/modules/roles/api/find-role-by-id';
import { RoleEditor } from '@/modules/roles/components/role-editor';

export const metadata: Metadata = { title: 'Perfil' };

export default async function RolePage({ params }: PageProps<'/roles/[roleId]'>) {
  const { roleId } = await params;
  await requireCapability(Feature.RoleView);

  const role = await orNotFound(findRoleById(roleId));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title={role.name}
        description={
          role.description ??
          `${role.userCount} ${role.userCount === 1 ? 'conta usa' : 'contas usam'} este perfil`
        }
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: 'Perfis e permissões', href: '/roles' }, { label: role.name }]}
          />
        }
      />

      <RoleEditor role={role} />
    </div>
  );
}
