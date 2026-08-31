import Link from 'next/link';
import { NAVIGATION } from '@/config/navigation';
import { getCurrentSession } from '@/shared/auth/current-session';
import { hasCapability } from '@/shared/auth/capabilities';
import { Card, CardContent } from '@/shared/components/card';
import { EmptyState } from '@/shared/components/empty-state';
import { PageHeader } from '@/shared/components/page-header';

export default async function HomePage() {
  const session = await getCurrentSession();

  const shortcuts = NAVIGATION.flatMap((group) => group.items).filter(
    (item) => item.feature === undefined || hasCapability(session, item.feature),
  );

  const firstName = session.name.split(' ')[0] ?? session.name;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader
        title={`Olá, ${firstName}`}
        description="Escolha por onde começar. O menu muda conforme o que o seu perfil permite."
      />

      {shortcuts.length === 0 ? (
        <EmptyState
          title="Sua conta ainda não tem permissões"
          description="Fale com a coordenação da escola para receber um perfil de acesso."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {shortcuts.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Card className="transition-colors hover:border-brand">
                  <CardContent className="flex items-center gap-3">
                    <Icon aria-hidden className="size-5 shrink-0 text-brand" />
                    <Link href={item.href} className="flex flex-1 items-center font-medium">
                      {item.label}
                    </Link>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
