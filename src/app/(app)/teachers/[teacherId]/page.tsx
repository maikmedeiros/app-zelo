import type { Metadata } from 'next';
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
import { findTeacherById } from '@/modules/teachers/api/find-teacher-by-id';
import { EditTeacherButton } from '@/modules/teachers/components/teacher-buttons';

export const metadata: Metadata = { title: 'Professor' };

export default async function TeacherPage({ params }: PageProps<'/teachers/[teacherId]'>) {
  const { teacherId } = await params;

  const session = await requireCapability(Feature.TeacherView);
  const teacher = await orNotFound(findTeacherById(teacherId));

  const canUpdate = hasCapability(session, Feature.TeacherUpdate);
  const canSeePerson = hasCapability(session, Feature.PersonView);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={teacher.personName}
        description={
          teacher.classCount === 1 ? '1 turma vigente' : `${teacher.classCount} turmas vigentes`
        }
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: 'Professores', href: '/teachers' }, { label: teacher.personName }]}
          />
        }
        actions={
          <>
            {teacher.active ? (
              <Badge tone="success">Ativo</Badge>
            ) : (
              <Badge tone="danger">Inativo</Badge>
            )}
            {canUpdate && <EditTeacherButton teacher={teacher} />}
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Dados do papel</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <dl className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">Matrícula funcional</dt>
              <dd>{teacher.registration ?? '—'}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">CPF</dt>
              <dd>{teacher.cpf === null ? '—' : formatCpf(teacher.cpf)}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-sm text-text-muted">Formação</dt>
              <dd className="whitespace-pre-line">{teacher.education ?? '—'}</dd>
            </div>
          </dl>

          <p className="text-sm text-text-muted">
            Nome, CPF e contato são da pessoa, não do papel.{' '}
            {canSeePerson && (
              <Link href={`/people/${teacher.personId}`} className="underline underline-offset-4">
                Editar na ficha da pessoa
              </Link>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
