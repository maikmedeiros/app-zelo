import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Feature } from '@/config/features';
import { isApiError } from '@/shared/api/errors';
import { RequireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { Pagination } from '@/shared/components/pagination';
import { findListJournalEntries } from '@/modules/students/api/find-list-journal-entries';
import { findStudentById } from '@/modules/students/api/find-student-by-id';
import { JournalDatePicker } from '@/modules/students/components/journal-date-picker';
import { JournalTimeline } from '@/modules/students/components/journal-timeline';
import type { StudentOutput } from '@/modules/students/types';

export const metadata: Metadata = { title: 'Agenda' };

const today = (): string => new Date().toISOString().slice(0, 10);

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

const loadStudent = async (studentId: string): Promise<StudentOutput> => {
  try {
    return await findStudentById(studentId);
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) notFound();
    throw error;
  }
};

export default async function JournalPage({
  params,
  searchParams,
}: PageProps<'/students/[studentId]/journal'>) {
  const { studentId } = await params;
  const { date, page } = await searchParams;

  const referenceDate = isIsoDate(date) ? date : today();
  const currentPage = Number(page) > 0 ? Number(page) : 1;

  const [student, entries] = await Promise.all([
    loadStudent(studentId),
    findListJournalEntries(studentId, { date: referenceDate, page: currentPage }),
  ]);

  return (
    <RequireCapability feature={Feature.JournalView}>
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
    </RequireCapability>
  );
}
