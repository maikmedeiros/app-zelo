import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { requireCapability } from '@/shared/auth/require-capability';
import { findListTeacherLinks } from '@/modules/teacher-links/api/find-list-teacher-links';
import { TeacherLinkTable } from '@/modules/teacher-links/components/teacher-link-table';

export const metadata: Metadata = { title: 'Professores da turma' };

export default async function ClassTeachersPage({
  params,
}: PageProps<'/classes/[classId]/teachers'>) {
  const { classId } = await params;

  await requireCapability(Feature.TeacherLinkView);
  const links = await findListTeacherLinks({ classId, limit: 100 });

  return <TeacherLinkTable links={links} />;
}
