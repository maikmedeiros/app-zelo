import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { ClassActions } from './class-actions';
import type { ClassOutput } from '../types';

const columns: Column<ClassOutput>[] = [
  {
    key: 'name',
    header: 'Turma',
    cell: (turma) => (
      <Link
        href={`/classes/${turma.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {turma.name}
      </Link>
    ),
  },
  { key: 'segment', header: 'Segmento', cell: (turma) => turma.segment },
  {
    key: 'shift',
    header: 'Turno',
    cell: (turma) => <Badge tone="brand">{ptBR.enums.classShift[turma.shift]}</Badge>,
  },
  { key: 'schoolYear', header: 'Ano letivo', cell: (turma) => turma.schoolYear },
  {
    key: 'studentCount',
    header: 'Alunos',
    align: 'right',
    cell: (turma) => turma.studentCount,
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (turma) => <ClassActions turma={turma} />,
  },
];

export function ClassTable({ classes }: { classes: Paginated<ClassOutput> }) {
  return (
    <DataTable
      data={classes}
      columns={columns}
      rowKey={(turma) => turma.id}
      emptyTitle="Nenhuma turma encontrada"
      emptyDescription="Ajuste os filtros ou crie a primeira turma do ano letivo."
    />
  );
}
