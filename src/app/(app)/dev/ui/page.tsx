import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { serverEnv } from '@/config/env.server';
import { PageHeader } from '@/shared/components/page-header';
import { UiCatalog } from './ui-catalog';

export const metadata: Metadata = { title: 'Catálogo de componentes' };

export default function DevUiPage() {
  if (serverEnv.isProduction) notFound();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <PageHeader
        title="Catálogo de componentes"
        description="Cada componente do design system nos estados que a interface usa. Só existe fora de produção."
      />

      <UiCatalog />
    </div>
  );
}
