import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { ConsentStateBadge, consentStateOf } from '@/shared/components/consent-badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import { RevokeConsentButton } from './revoke-consent-button';
import type { ConsentOutput } from '../types';

const columns: Column<ConsentOutput>[] = [
  {
    key: 'type',
    header: 'Tipo',
    cell: (consent) => <span className="font-medium">{ptBR.enums.consentType[consent.type]}</span>,
  },
  {
    key: 'decision',
    header: 'Decisão',
    cell: (consent) => <ConsentStateBadge state={consentStateOf(consent.granted)} />,
  },
  {
    key: 'origin',
    header: 'Origem',
    cell: (consent) => ptBR.enums.consentOrigin[consent.origin],
  },
  {
    key: 'validity',
    header: 'Vigência',
    cell: (consent) =>
      consent.current ? (
        <Badge tone="success">Desde {formatDate(consent.startedAt)}</Badge>
      ) : (
        <Badge>
          {formatDate(consent.startedAt)} a {formatDate(consent.endedAt ?? '')}
        </Badge>
      ),
  },
  {
    key: 'guardian',
    header: 'Assinou',
    cell: (consent) => consent.guardianName ?? '—',
  },
  {
    key: 'recorded',
    header: 'Registrado por',
    cell: (consent) => (
      <span className="flex flex-col">
        <span>{consent.recordedByName}</span>
        {consent.documentKey !== null && (
          <span className="text-sm text-text-muted">Documento: {consent.documentKey}</span>
        )}
        {consent.note !== null && <span className="text-sm text-text-muted">{consent.note}</span>}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (consent) => <RevokeConsentButton consent={consent} />,
  },
];

export function ConsentHistoryTable({ consents }: { consents: Paginated<ConsentOutput> }) {
  return (
    <DataTable
      data={consents}
      columns={columns}
      rowKey={(consent) => consent.id}
      rowClassName={(consent) => (consent.current ? undefined : 'text-text-muted')}
      emptyTitle="Nenhum consentimento registrado"
      emptyDescription="Cada linha aqui é um fato datado: quem decidiu, quando e com que origem. Sem linha vigente, a escola não usa a imagem da criança."
    />
  );
}
