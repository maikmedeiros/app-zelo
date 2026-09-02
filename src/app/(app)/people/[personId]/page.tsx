import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { requireCapability } from '@/shared/auth/require-capability';
import { Badge } from '@/shared/components/badge';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { PageHeader } from '@/shared/components/page-header';
import { formatCpf } from '@/shared/utils/cpf';
import { formatAge, formatDate } from '@/shared/utils/date';
import { formatPhone } from '@/shared/utils/phone';
import { findPersonById } from '@/modules/people/api/find-person-by-id';
import { EditPersonButton } from '@/modules/people/components/edit-person-button';
import { PersonRolesCard } from '@/modules/people/components/person-roles-card';
import { PhotoManager } from '@/modules/people/components/photo-manager';
import { displayName } from '@/modules/people/types';

export const metadata: Metadata = { title: 'Pessoa' };

function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function PersonPage({ params }: PageProps<'/people/[personId]'>) {
  const { personId } = await params;

  await requireCapability(Feature.PersonView);
  const person = await orNotFound(findPersonById(personId));

  const age = person.birthDate === null ? null : formatAge(person.birthDate);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={displayName(person)}
        description={person.socialName === null ? undefined : `Registro: ${person.name}`}
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: 'Pessoas', href: '/people' }, { label: displayName(person) }]}
          />
        }
        actions={
          <>
            {person.hasUser ? <Badge tone="success">Tem login</Badge> : <Badge>Sem login</Badge>}
            <EditPersonButton person={person} />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3">
              <DataRow label="Nascimento">
                {person.birthDate === null
                  ? '—'
                  : `${formatDate(person.birthDate)}${age === null ? '' : ` · ${age}`}`}
              </DataRow>
              <DataRow label="CPF">
                {person.cpf === null ? (
                  <span className="text-text-muted">Sem CPF — exigido para papel adulto</span>
                ) : (
                  formatCpf(person.cpf)
                )}
              </DataRow>
              <DataRow label="Telefone">
                {person.phone === null ? '—' : formatPhone(person.phone)}
              </DataRow>
              <DataRow label="E-mail de contato">{person.contactEmail ?? '—'}</DataRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foto</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoManager
              personId={person.id}
              personName={displayName(person)}
              hasPhoto={person.hasPhoto}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Papéis na escola</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonRolesCard person={person} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
