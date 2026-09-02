import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { findListTeacherLinks } from '@/modules/teacher-links/api/find-list-teacher-links';
import { NewTeacherLinkButton } from '@/modules/teacher-links/components/new-teacher-link-button';
import { TeacherLinkTable } from '@/modules/teacher-links/components/teacher-link-table';

export const metadata: Metadata = { title: 'Professores da turma' };

export default async function ClassTeachersPage({
  params,
}: PageProps<'/classes/[classId]/teachers'>) {
  const { classId } = await params;

  const session = await requireCapability(Feature.TeacherLinkView);
  const links = await findListTeacherLinks({ classId, limit: 100 });

  const canCreate = hasCapability(session, Feature.TeacherLinkCreate);

  return (
    <div className="flex flex-col gap-6">
      {canCreate && (
        <div className="flex justify-end">
          <NewTeacherLinkButton classId={classId} />
        </div>
      )}

      <TeacherLinkTable
        links={links}
        hideClass
        emptyTitle="Nenhum professor vinculado"
        emptyDescription={
          canCreate
            ? 'Sem vínculo, ninguém publica nesta turma.'
            : 'Os vínculos de professor com turma são criados na tela de vínculos.'
        }
      />
    </div>
  );
}
