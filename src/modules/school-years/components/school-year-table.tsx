import type { Paginated } from '@/shared/api/types';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/date';
import { SchoolYearActions } from './school-year-actions';
import type { SchoolYearOutput } from '../types';

const columns: Column<SchoolYearOutput>[] = [
  {
    key: 'year',
    header: 'Ano',
    cell: (schoolYear) => <span className="font-medium">{schoolYear.year}</span>,
  },
  {
    key: 'period',
    header: 'Período letivo',
    cell: (schoolYear) => `${formatDate(schoolYear.startDate)} a ${formatDate(schoolYear.endDate)}`,
  },
  {
    key: 'classes',
    header: 'Turmas',
    align: 'right',
    cell: (schoolYear) => schoolYear.classCount,
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (schoolYear) => <SchoolYearActions schoolYear={schoolYear} />,
  },
];

export function SchoolYearTable({ schoolYears }: { schoolYears: Paginated<SchoolYearOutput> }) {
  return (
    <DataTable
      data={schoolYears}
      columns={columns}
      rowKey={(schoolYear) => schoolYear.id}
      emptyTitle="Nenhum ano letivo cadastrado"
      emptyDescription="Sem ano letivo não há turma: é ele que separa a Maternal I A de 2026 da de 2027."
    />
  );
}
