import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import type { GuardianLinkOutput } from '../types';

export function GuardianLinkList({ links }: { links: GuardianLinkOutput[] }) {
  if (links.length === 0) {
    return (
      <p className="text-text-muted">
        Nenhum responsável vinculado. Sem vínculo, a família não vê a agenda nem o feed da criança.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.id} className="flex items-center gap-3">
          <Avatar name={link.guardianName} size="sm" />

          <div className="flex flex-1 flex-col gap-1">
            <span className="font-medium">{link.guardianName}</span>
            <span className="flex flex-wrap items-center gap-1.5">
              <Badge tone="brand">{ptBR.enums.relationship[link.relationship]}</Badge>
              {link.canConsent && <Badge tone="success">Pode consentir</Badge>}
              {link.financial && <Badge>Financeiro</Badge>}
              {link.endDate !== null && (
                <Badge tone="danger">Encerrado em {formatDate(link.endDate)}</Badge>
              )}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
