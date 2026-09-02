import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { CalendarDays, ShieldCheck } from 'lucide-react';
import { Feature } from '@/config/features';
import { orNotFound, orNull } from '@/shared/api/not-found';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { Button } from '@/shared/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { ConsentBadge, consentStateOf } from '@/shared/components/consent-badge';
import { PageHeader } from '@/shared/components/page-header';
import { formatAge, formatDate } from '@/shared/utils/date';
import { findListEnrollments } from '@/modules/enrollments/api/find-list-enrollments';
import { EndEnrollmentButton } from '@/modules/enrollments/components/end-enrollment-button';
import { findListGuardianLinks } from '@/modules/guardian-links/api/find-list-guardian-links';
import { GuardianLinkList } from '@/modules/guardian-links/components/guardian-link-list';
import { findListConsents } from '@/modules/students/api/find-list-consents';
import { findStudentById } from '@/modules/students/api/find-student-by-id';
import { StudentActions } from '@/modules/students/components/student-actions';
import { CONSENT_TYPES } from '@/modules/students/types';
import { isCurrent } from '@/modules/enrollments/types';

const getStudentById = cache((id: string) => orNotFound(findStudentById(id)));

export const generateMetadata = async ({
  params,
}: PageProps<'/students/[studentId]'>): Promise<Metadata> => {
  const { studentId } = await params;
  const student = await getStudentById(studentId);

  return { title: student.personName };
};

function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function StudentPage({ params }: PageProps<'/students/[studentId]'>) {
  const { studentId } = await params;
  const session = await requireCapability(Feature.StudentView);

  const canSeeGuardians = hasCapability(session, Feature.GuardianLinkView);
  const canSeeEnrollments = hasCapability(session, Feature.EnrollmentView);
  const canSeeConsents = hasCapability(session, Feature.ConsentView);

  const [student, guardianLinks, enrollments, consents] = await Promise.all([
    getStudentById(studentId),
    canSeeGuardians ? findListGuardianLinks({ studentId, limit: 100 }) : null,
    canSeeEnrollments ? findListEnrollments({ studentId, limit: 100 }) : null,
    canSeeConsents ? orNull(findListConsents(studentId, { current: true, limit: 100 })) : null,
  ]);

  const currentEnrollment = enrollments?.results.find(isCurrent) ?? null;
  const age = student.birthDate === null ? null : formatAge(student.birthDate);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={student.personName}
        description={student.className ?? 'Sem matrícula vigente'}
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: 'Alunos', href: '/students' }, { label: student.personName }]}
          />
        }
        actions={
          <>
            {consents !== null && (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/students/${student.id}/consents`}>
                  <ShieldCheck aria-hidden className="size-4" />
                  Consentimentos
                </Link>
              </Button>
            )}
            {hasCapability(session, Feature.JournalView) && (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/students/${student.id}/journal`}>
                  <CalendarDays aria-hidden className="size-4" />
                  Agenda
                </Link>
              </Button>
            )}
            <StudentActions student={student} redirectOnDelete />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Avatar name={student.personName} personId={student.personId} size="lg" />

            <dl className="flex flex-1 flex-col gap-3">
              <DataRow label="Situação">
                {student.active ? (
                  <Badge tone="success">Ativo</Badge>
                ) : (
                  <Badge tone="danger">Inativo</Badge>
                )}
              </DataRow>

              <DataRow label="Código de matrícula">{student.code ?? '—'}</DataRow>

              <DataRow label="Nascimento">
                {student.birthDate === null
                  ? '—'
                  : `${formatDate(student.birthDate)}${age === null ? '' : ` · ${age}`}`}
              </DataRow>

              <DataRow label="Observações">
                {student.notes ?? <span className="text-text-muted">Nada registrado</span>}
              </DataRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turma</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {student.classId === null ? (
              <p className="text-text-muted">
                Sem matrícula vigente. Sem turma, a criança não recebe postagem nem agenda.
              </p>
            ) : (
              <Link
                href={`/classes/${student.classId}`}
                className="font-medium underline-offset-4 hover:underline"
              >
                {student.className}
              </Link>
            )}

            {currentEnrollment !== null && (
              <>
                <p className="text-sm text-text-muted">
                  Matriculado desde {formatDate(currentEnrollment.startDate)}
                </p>
                <div className="self-start">
                  <EndEnrollmentButton enrollment={currentEnrollment} />
                </div>
              </>
            )}

            {enrollments !== null && enrollments.results.some((item) => !isCurrent(item)) && (
              <div className="flex flex-col gap-1 border-t border-border pt-3">
                <p className="text-sm font-medium">Matrículas anteriores</p>
                <ul className="flex flex-col gap-1 text-sm text-text-muted">
                  {enrollments.results
                    .filter((item) => !isCurrent(item))
                    .map((item) => (
                      <li key={item.id}>
                        {item.className} · {formatDate(item.startDate)} a{' '}
                        {formatDate(item.endDate ?? '')}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {consents !== null && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Consentimento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-text-muted">
                O que vale hoje. Sem registro vigente, a resposta é não.
              </p>

              <div className="flex flex-wrap gap-2">
                {CONSENT_TYPES.map((type) => (
                  <ConsentBadge
                    key={type}
                    type={type}
                    state={consentStateOf(
                      consents.results.find((consent) => consent.type === type)?.granted,
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {guardianLinks !== null && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <GuardianLinkList links={guardianLinks.results} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
