import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/date';
import { ReportStatusBadge } from './report-status-badge';
import { isPublished, type ReportOutput } from '../types';

const columns: Column<ReportOutput>[] = [
  {
    key: 'student',
    header: 'Criança',
    cell: (report) => (
      <Link
        href={`/reports/${report.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {report.studentName}
      </Link>
    ),
  },
  {
    key: 'class',
    header: 'Turma',
    cell: (report) => report.className,
  },
  {
    key: 'period',
    header: 'Período',
    cell: (report) => `${formatDate(report.periodStart)} a ${formatDate(report.periodEnd)}`,
  },
  {
    key: 'author',
    header: 'Autor',
    cell: (report) => report.authorName,
  },
  {
    key: 'status',
    header: 'Situação',
    cell: (report) => <ReportStatusBadge status={report.status} />,
  },
];

export function ReportTable({ reports }: { reports: Paginated<ReportOutput> }) {
  return (
    <DataTable
      data={reports}
      columns={columns}
      rowKey={(report) => report.id}
      rowClassName={(report) => (isPublished(report) ? undefined : 'text-text-muted')}
      emptyTitle="Nenhum relatório encontrado"
      emptyDescription="O relatório fecha um período de acompanhamento da criança nas sete dimensões."
    />
  );
}
