import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import { GuardianLinkActions } from './guardian-link-actions';
import { isCurrent, type GuardianLinkOutput } from '../types';

const columns: Column<GuardianLinkOutput>[] = [
  {
    key: 'guardian',
    header: 'Responsável',
    cell: (link) => (
      <Link
        href={`/guardians/${link.guardianId}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {link.guardianName}
      </Link>
    ),
  },
  {
    key: 'student',
    header: 'Criança',
    cell: (link) => (
      <Link href={`/students/${link.studentId}`} className="underline-offset-4 hover:underline">
        {link.studentName}
      </Link>
    ),
  },
  {
    key: 'relationship',
    header: 'Parentesco',
    cell: (link) => <Badge tone="brand">{ptBR.enums.relationship[link.relationship]}</Badge>,
  },
  {
    key: 'permissions',
    header: 'Pode',
    cell: (link) => (
      <span className="flex flex-wrap gap-1.5">
        {link.canConsent && <Badge tone="success">Consentir</Badge>}
        {link.financial && <Badge>Financeiro</Badge>}
        {!link.canConsent && !link.financial && (
          <span className="text-sm text-text-muted">Só acompanhar</span>
        )}
      </span>
    ),
  },
  {
    key: 'validity',
    header: 'Vigência',
    cell: (link) =>
      isCurrent(link) ? (
        <Badge tone="success">Desde {formatDate(link.startDate)}</Badge>
      ) : (
        <Badge>Encerrado em {formatDate(link.endDate ?? '')}</Badge>
      ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (link) => <GuardianLinkActions link={link} />,
  },
];

export function GuardianLinkTable({ links }: { links: Paginated<GuardianLinkOutput> }) {
  return (
    <DataTable
      data={links}
      columns={columns}
      rowKey={(link) => link.id}
      rowClassName={(link) => (isCurrent(link) ? undefined : 'text-text-muted')}
      emptyTitle="Nenhum vínculo encontrado"
      emptyDescription="Sem vínculo, a família não vê a agenda nem o feed da criança."
    />
  );
}
