import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListRoleGrants } from '@/modules/role-grants/api/find-list-role-grants';
import { NewRoleGrantButton } from '@/modules/role-grants/components/new-role-grant-button';
import { RoleGrantFilters } from '@/modules/role-grants/components/role-grant-filters';
import { RoleGrantTable } from '@/modules/role-grants/components/role-grant-table';
import { findListRoleGrantsSchema } from '@/modules/role-grants/schemas/find-list-role-grants';

export const metadata: Metadata = { title: 'Concessões de perfil' };

export default async function RoleGrantsPage({ searchParams }: PageProps<'/role-grants'>) {
  const params = parseSearchParams(findListRoleGrantsSchema, await searchParams);
  const session = await requireCapability(Feature.RoleGrantView);

  const grants = await findListRoleGrants(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Concessões de perfil"
        description="É a concessão que liga a conta ao perfil. Encerrar não apaga: a vigência fecha e o histórico responde quem podia o quê, e quando."
        actions={
          hasCapability(session, Feature.RoleGrantCreate) ? <NewRoleGrantButton /> : undefined
        }
      />

      <RoleGrantFilters />

      <RoleGrantTable grants={grants} />
    </div>
  );
}
