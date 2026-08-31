import type { Metadata } from 'next';
import { ptBR } from '@/shared/i18n/pt-BR';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: ptBR.auth.signInTitle };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-brand">{ptBR.app.name}</h1>
        <p className="text-text-muted">{ptBR.auth.signInSubtitle}</p>
      </header>

      <LoginForm next={typeof next === 'string' ? next : undefined} />
    </main>
  );
}
