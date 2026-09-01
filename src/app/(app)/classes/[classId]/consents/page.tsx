import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { requireCapability } from '@/shared/auth/require-capability';
import { findListClassConsents } from '@/modules/classes/api/find-list-class-consents';
import { ClassConsentTable } from '@/modules/classes/components/class-consent-table';

export const metadata: Metadata = { title: 'Consentimentos da turma' };

export default async function ClassConsentsPage({
  params,
  searchParams,
}: PageProps<'/classes/[classId]/consents'>) {
  const { classId } = await params;
  const { page } = await searchParams;

  await requireCapability(Feature.ConsentView);

  const consents = await findListClassConsents(classId, {
    page: Number(page) > 0 ? Number(page) : 1,
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-muted">
        O que a escola pode fazer com a imagem de cada criança, hoje. Sem registro vigente, a
        resposta é não.
      </p>

      <ClassConsentTable consents={consents} />
    </div>
  );
}
