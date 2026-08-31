import Link from 'next/link';
import { ptBR } from '@/shared/i18n/pt-BR';

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold">{ptBR.errors.notFoundTitle}</h1>
      <p className="text-text-muted">{ptBR.errors.notFoundDescription}</p>
      <Link href="/" className="font-medium text-brand underline underline-offset-4">
        {ptBR.errors.backHome}
      </Link>
    </main>
  );
}
