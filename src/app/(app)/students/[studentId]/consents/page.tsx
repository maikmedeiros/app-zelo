import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { findListConsents } from '@/modules/students/api/find-list-consents';
import { findStudentById } from '@/modules/students/api/find-student-by-id';
import { ConsentFilters } from '@/modules/students/components/consent-filters';
import { ConsentHistoryTable } from '@/modules/students/components/consent-history-table';
import { ConsentSummary } from '@/modules/students/components/consent-summary';
import { NewConsentButton } from '@/modules/students/components/new-consent-button';
import { findListConsentsSchema } from '@/modules/students/schemas/consents';

export const metadata: Metadata = { title: 'Consentimentos' };

export default async function StudentConsentsPage({
  params,
  searchParams,
}: PageProps<'/students/[studentId]/consents'>) {
  const { studentId } = await params;
  const filters = parseSearchParams(findListConsentsSchema, await searchParams);
  const session = await requireCapability(Feature.ConsentView);

  const [student, current, history] = await Promise.all([
    orNotFound(findStudentById(studentId)),
    orNotFound(findListConsents(studentId, { current: true, limit: 100 })),
    orNotFound(findListConsents(studentId, filters)),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title={`Consentimentos de ${student.personName}`}
        description="O que a família autorizou, desde quando e por qual origem. Sem registro vigente, a escola não usa a imagem da criança."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Alunos', href: '/students' },
              { label: student.personName, href: `/students/${student.id}` },
              { label: 'Consentimentos' },
            ]}
          />
        }
        actions={
          hasCapability(session, Feature.ConsentCreate) ? (
            <NewConsentButton studentId={student.id} studentName={student.personName} />
          ) : undefined
        }
      />

      <ConsentSummary
        studentId={student.id}
        studentName={student.personName}
        current={current.results}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Histórico</h2>

        <p className="text-text-muted">
          Cada linha é um fato datado. Revogar não apaga: encerra a vigência e abre outra linha.
        </p>

        <ConsentFilters />

        <ConsentHistoryTable consents={history} />
      </section>
    </div>
  );
}
