import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { parseSearchParams } from '@/shared/api/search-params';
import { hasCapability } from '@/shared/auth/capabilities';
import { requireCapability } from '@/shared/auth/require-capability';
import { PageHeader } from '@/shared/components/page-header';
import { findListTeacherLinks } from '@/modules/teacher-links/api/find-list-teacher-links';
import { NewTeacherLinkButton } from '@/modules/teacher-links/components/new-teacher-link-button';
import { TeacherLinkFilters } from '@/modules/teacher-links/components/teacher-link-filters';
import { TeacherLinkTable } from '@/modules/teacher-links/components/teacher-link-table';
import { findListTeacherLinksSchema } from '@/modules/teacher-links/schemas/find-list-teacher-links';

export const metadata: Metadata = { title: 'Professor e turma' };

export default async function TeacherLinksPage({ searchParams }: PageProps<'/teacher-links'>) {
  const params = parseSearchParams(findListTeacherLinksSchema, await searchParams);
  const session = await requireCapability(Feature.TeacherLinkView);

  const links = await findListTeacherLinks(params);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        title="Professor e turma"
        description="É este vínculo que dá o escopo de escrita: quem publica na turma é a equipe dela. Trocar de turma é encerrar e criar outro."
        actions={
          hasCapability(session, Feature.TeacherLinkCreate) ? <NewTeacherLinkButton /> : undefined
        }
      />

      <TeacherLinkFilters />

      <TeacherLinkTable links={links} />
    </div>
  );
}
