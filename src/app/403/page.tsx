import Link from 'next/link';
import type { Metadata } from 'next';
import { ptBR } from '@/shared/i18n/pt-BR';

export const metadata: Metadata = { title: ptBR.forbidden.title };

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold">{ptBR.forbidden.title}</h1>
      <p className="text-text-muted">{ptBR.forbidden.description}</p>
      <Link href="/" className="font-medium text-brand underline underline-offset-4">
        {ptBR.forbidden.back}
      </Link>
    </main>
  );
}
