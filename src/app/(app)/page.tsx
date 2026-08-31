import { getCurrentSession } from '@/shared/auth/current-session';
import { ptBR } from '@/shared/i18n/pt-BR';
import { SignOutButton } from './sign-out-button';

export default async function HomePage() {
  const session = await getCurrentSession();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-brand">{ptBR.app.name}</h1>
        <p className="text-text-muted">
          {session.name} · {session.email}
        </p>
      </header>

      <dl className="grid gap-3 rounded-card border border-border bg-surface p-4">
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-text-muted">Perfis</dt>
          <dd>{session.roles.join(', ') || '—'}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-text-muted">Turmas no escopo</dt>
          <dd>{session.classes.length}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-text-muted">Concessões</dt>
          <dd>{session.permissions.length}</dd>
        </div>
      </dl>

      <SignOutButton />
    </main>
  );
}
