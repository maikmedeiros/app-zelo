import { Feature } from '@/config/features';
import { requireCapability } from '@/shared/auth/require-capability';
import { Badge } from '@/shared/components/badge';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { ptBR } from '@/shared/i18n/pt-BR';
import { getClassById } from '@/modules/classes/api/get-class-by-id';
import { ClassActions } from '@/modules/classes/components/class-actions';
import { ClassTabs } from '@/modules/classes/components/class-tabs';

export default async function ClassLayout({ params, children }: LayoutProps<'/classes/[classId]'>) {
  const { classId } = await params;

  await requireCapability(Feature.ClassView);
  const turma = await getClassById(classId);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title={turma.name}
        description={`${turma.segment} · ${ptBR.enums.classShift[turma.shift]} · ${turma.schoolYear}`}
        breadcrumbs={
          <Breadcrumbs items={[{ label: 'Turmas', href: '/classes' }, { label: turma.name }]} />
        }
        actions={
          <>
            <Badge tone="brand">
              {turma.studentCount === 1 ? '1 aluno' : `${turma.studentCount} alunos`}
            </Badge>
            <ClassActions turma={turma} redirectOnDelete />
          </>
        }
      />

      <ClassTabs classId={turma.id} />

      {children}
    </div>
  );
}
