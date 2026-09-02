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
import { formatCpf } from '@/shared/utils/cpf';
import { formatPhone } from '@/shared/utils/phone';
import { findGuardianById } from '@/modules/guardians/api/find-guardian-by-id';
import { NotificationPreferences } from '@/modules/guardians/components/notification-preferences';

const getGuardianById = cache((id: string) => orNotFound(findGuardianById(id)));

export const generateMetadata = async ({
  params,
}: PageProps<'/guardians/[guardianId]'>): Promise<Metadata> => {
  const { guardianId } = await params;
  const guardian = await getGuardianById(guardianId);

  return { title: guardian.personName };
};

export default async function GuardianPage({ params }: PageProps<'/guardians/[guardianId]'>) {
  const { guardianId } = await params;

  const session = await requireCapability(Feature.GuardianView);
  const guardian = await getGuardianById(guardianId);

  const canSeePerson = hasCapability(session, Feature.PersonView);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={guardian.personName}
        description={
          guardian.studentCount === 1
            ? 'Responsável por 1 criança'
            : `Responsável por ${guardian.studentCount} crianças`
        }
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: 'Responsáveis', href: '/guardians' }, { label: guardian.personName }]}
          />
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <dl className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <dt className="text-sm text-text-muted">CPF</dt>
                <dd>{guardian.cpf === null ? '—' : formatCpf(guardian.cpf)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-sm text-text-muted">Telefone</dt>
                <dd>{guardian.phone === null ? '—' : formatPhone(guardian.phone)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-sm text-text-muted">E-mail</dt>
                <dd>{guardian.contactEmail ?? '—'}</dd>
              </div>
            </dl>

            <p className="text-sm text-text-muted">
              Nome, CPF e contato são da pessoa, não do papel.{' '}
              {canSeePerson ? (
                <Link
                  href={`/people/${guardian.personId}`}
                  className="underline underline-offset-4"
                >
                  Editar na ficha da pessoa
                </Link>
              ) : (
                'A correção é feita no cadastro de pessoas.'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avisos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <NotificationPreferences guardian={guardian} />

            <Badge>É só isto que o papel guarda</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
