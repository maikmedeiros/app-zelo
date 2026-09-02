import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { getClassById } from '@/modules/classes/api/get-class-by-id';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { getCurrentSession } from '@/shared/auth/current-session';
import { EmptyState } from '@/shared/components/empty-state';
import { findClassById } from '@/modules/classes/api/find-class-by-id';
import { findListStudents } from '@/modules/students/api/find-list-students';
import { StudentFilters } from '@/modules/students/components/student-filters';
import { StudentTable } from '@/modules/students/components/student-table';
import { findListStudentsSchema } from '@/modules/students/schemas/find-list-students';
import { EnrollStudentButton } from '@/modules/enrollments/components/enroll-student-button';

export const generateMetadata = async ({
  params,
}: PageProps<'/classes/[classId]'>): Promise<Metadata> => {
  const { classId } = await params;
  const turma = await getClassById(classId);

  return { title: `Alunos · ${turma.name}` };
};

export default async function ClassStudentsPage({
  params,
  searchParams,
}: PageProps<'/classes/[classId]'>) {
  const { classId } = await params;
  const filters = parseSearchParams(findListStudentsSchema, await searchParams);
  const session = await getCurrentSession();

  if (!hasCapability(session, Feature.StudentView)) {
    return (
      <EmptyState
        title="Sem acesso à lista de alunos"
        description="Seu perfil vê a turma, mas não as crianças dela."
      />
    );
  }

  const [turma, students] = await Promise.all([
    findClassById(classId),
    findListStudents({ ...filters, classId }),
  ]);

  const canEnroll = hasCapability(session, Feature.EnrollmentCreate);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <StudentFilters lockedClassId={classId} />
        {canEnroll && <EnrollStudentButton classId={turma.id} className={turma.name} />}
      </div>

      <StudentTable
        students={students}
        hideClass
        emptyTitle="Nenhum aluno nesta turma"
        emptyDescription={
          canEnroll
            ? 'Matricule a primeira criança para a turma começar a ter agenda e feed.'
            : 'Quando a secretaria matricular alguém, a lista aparece aqui.'
        }
      />
    </div>
  );
}
