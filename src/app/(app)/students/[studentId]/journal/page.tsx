import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { requireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { Pagination } from '@/shared/components/pagination';
import { todayIso } from '@/shared/utils/date';
import { findListJournalEntries } from '@/modules/students/api/find-list-journal-entries';
import { findStudentById } from '@/modules/students/api/find-student-by-id';
import { JournalDatePicker } from '@/modules/students/components/journal-date-picker';
import { JournalTimeline } from '@/modules/students/components/journal-timeline';

export const metadata: Metadata = { title: 'Agenda' };

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export default async function JournalPage({
  params,
  searchParams,
}: PageProps<'/students/[studentId]/journal'>) {
  const { studentId } = await params;
  const { date, page } = await searchParams;

  const referenceDate = isIsoDate(date) ? date : todayIso();
  const currentPage = Number(page) > 0 ? Number(page) : 1;

  await requireCapability(Feature.JournalView);

  const [student, entries] = await Promise.all([
    orNotFound(findStudentById(studentId)),
    findListJournalEntries(studentId, { date: referenceDate, page: currentPage }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={`Agenda de ${student.personName}`}
        description={student.className ?? 'Sem turma vigente'}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Alunos', href: '/students' },
              { label: student.personName, href: `/students/${student.id}` },
              { label: 'Agenda' },
            ]}
          />
        }
      />

      <JournalDatePicker date={referenceDate} />

      <JournalTimeline studentId={student.id} referenceDate={referenceDate} entries={entries} />

      <Pagination
        page={entries.page}
        totalPages={entries.totalPages}
        totalResults={entries.totalResults}
      />
    </div>
  );
}
