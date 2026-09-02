import type { Metadata } from 'next';
import Link from 'next/link';
import { Feature } from '@/config/features';
import { hasCapability } from '@/shared/auth/capabilities';
import { getCurrentSession } from '@/shared/auth/current-session';
import { Badge } from '@/shared/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { PageHeader } from '@/shared/components/page-header';
import { PhotoManager } from '@/modules/people/components/photo-manager';
import { findPersonById } from '@/modules/people/api/find-person-by-id';
import { isApiError } from '@/shared/api/errors';
import type { PersonOutput } from '@/modules/people/types';

export const metadata: Metadata = { title: 'Minha conta' };

const loadPerson = async (personId: string): Promise<PersonOutput | null> => {
  try {
    return await findPersonById(personId);
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) return null;
    throw error;
  }
};

export default async function AccountPage() {
  const session = await getCurrentSession();

  const person = hasCapability(session, Feature.PersonView)
    ? await loadPerson(session.personId)
    : null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader
        title="Minha conta"
        description="Seus dados de acesso e a foto que a escola e as famílias veem."
      />

      <Card>
        <CardHeader>
          <CardTitle>Acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">Nome</dt>
              <dd>{session.name}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">E-mail</dt>
              <dd>{session.email}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">Perfis</dt>
              <dd className="flex flex-wrap gap-1.5">
                {session.roles.length === 0 ? (
                  <Badge tone="accent">Sem perfil</Badge>
                ) : (
                  session.roles.map((role) => (
                    <Badge key={role} tone="brand">
                      {role}
                    </Badge>
                  ))
                )}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-text-muted">
            {hasCapability(session, Feature.UserUpdate) ? (
              <Link href={`/users/${session.id}`} className="underline underline-offset-4">
                Trocar e-mail ou senha
              </Link>
            ) : (
              'Para trocar e-mail ou senha, fale com a coordenação da escola.'
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Minha foto</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoManager
            personId={session.personId}
            personName={session.name}
            hasPhoto={person?.hasPhoto ?? true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
