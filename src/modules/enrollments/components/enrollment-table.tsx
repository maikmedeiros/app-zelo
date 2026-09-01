import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/date';
import { EndEnrollmentButton } from './end-enrollment-button';
import { isCurrent, type EnrollmentOutput } from '../types';

const columns: Column<EnrollmentOutput>[] = [
  {
    key: 'student',
    header: 'Aluno',
    cell: (enrollment) => (
      <Link
        href={`/students/${enrollment.studentId}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {enrollment.studentName}
      </Link>
    ),
  },
  {
    key: 'class',
    header: 'Turma',
    cell: (enrollment) => (
      <Link href={`/classes/${enrollment.classId}`} className="underline-offset-4 hover:underline">
        {enrollment.className}
      </Link>
    ),
  },
  { key: 'startDate', header: 'Início', cell: (enrollment) => formatDate(enrollment.startDate) },
  {
    key: 'status',
    header: 'Situação',
    cell: (enrollment) =>
      isCurrent(enrollment) ? (
        <Badge tone="success">Vigente</Badge>
      ) : (
        <Badge>Encerrada em {formatDate(enrollment.endDate ?? '')}</Badge>
      ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (enrollment) => <EndEnrollmentButton enrollment={enrollment} />,
  },
];

export function EnrollmentTable({ enrollments }: { enrollments: Paginated<EnrollmentOutput> }) {
  return (
    <DataTable
      data={enrollments}
      columns={columns}
      rowKey={(enrollment) => enrollment.id}
      emptyTitle="Nenhuma matrícula encontrada"
      emptyDescription="Ajuste os filtros ou matricule a primeira criança da turma."
    />
  );
}
