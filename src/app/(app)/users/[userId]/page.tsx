import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { Badge } from '@/shared/components/badge';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { PageHeader } from '@/shared/components/page-header';
import { findUserById } from '@/modules/users/api/find-user-by-id';
import { UserActions } from '@/modules/users/components/user-actions';

const getUserById = cache((id: string) => orNotFound(findUserById(id)));

export const generateMetadata = async ({
  params,
}: PageProps<'/users/[userId]'>): Promise<Metadata> => {
  const { userId } = await params;
  const user = await getUserById(userId);

  return { title: user.personName };
};

const lastAccess = (iso: string | null): string =>
  iso === null
    ? 'Nunca acessou'
    : new Date(iso).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

export default async function UserPage({ params }: PageProps<'/users/[userId]'>) {
  const { userId } = await params;

  const session = await requireCapability(Feature.UserView);
  const user = await getUserById(userId);

  const canSeePerson = hasCapability(session, Feature.PersonView);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={user.personName}
        description={user.email}
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: 'Contas de acesso', href: '/users' }, { label: user.personName }]}
          />
        }
        actions={
          user.active ? (
            <Badge tone="success">Ativa</Badge>
          ) : (
            <Badge tone="danger">Desativada</Badge>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Acesso</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">Perfis vigentes</dt>
              <dd className="flex flex-wrap gap-1.5">
                {user.profiles.length === 0 ? (
                  <Badge tone="accent">Sem perfil — a conta entra e não vê nada</Badge>
                ) : (
                  user.profiles.map((profile) => (
                    <Badge key={profile} tone="brand">
                      {profile}
                    </Badge>
                  ))
                )}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">Último acesso</dt>
              <dd>{lastAccess(user.lastAccessAt)}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">E-mail verificado</dt>
              <dd>{user.emailVerified ? 'Sim' : 'Não'}</dd>
            </div>
          </dl>

          <UserActions user={user} />

          {canSeePerson && (
            <p className="text-sm text-text-muted">
              <Link href={`/people/${user.personId}`} className="underline underline-offset-4">
                Ver a pessoa por trás desta conta
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
