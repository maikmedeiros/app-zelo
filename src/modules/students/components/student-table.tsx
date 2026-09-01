import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/date';
import { StudentActions } from './student-actions';
import type { StudentOutput } from '../types';

const identity: Column<StudentOutput> = {
  key: 'personName',
  header: 'Aluno',
  cell: (student) => (
    <span className="flex items-center gap-3">
      <Avatar name={student.personName} personId={student.personId} size="sm" />
      <Link
        href={`/students/${student.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {student.personName}
      </Link>
    </span>
  ),
};

const code: Column<StudentOutput> = {
  key: 'code',
  header: 'Código',
  cell: (student) => student.code ?? '—',
};

const className: Column<StudentOutput> = {
  key: 'className',
  header: 'Turma',
  cell: (student) =>
    student.classId === null ? (
      <span className="text-text-muted">Sem matrícula vigente</span>
    ) : (
      <Link href={`/classes/${student.classId}`} className="underline-offset-4 hover:underline">
        {student.className}
      </Link>
    ),
};

const birthDate: Column<StudentOutput> = {
  key: 'birthDate',
  header: 'Nascimento',
  cell: (student) => (student.birthDate === null ? '—' : formatDate(student.birthDate)),
};

const status: Column<StudentOutput> = {
  key: 'active',
  header: 'Situação',
  cell: (student) =>
    student.active ? <Badge tone="success">Ativo</Badge> : <Badge tone="danger">Inativo</Badge>,
};

const actions: Column<StudentOutput> = {
  key: 'actions',
  header: '',
  align: 'right',
  cell: (student) => <StudentActions student={student} />,
};

export interface StudentTableProps {
  students: Paginated<StudentOutput>;
  hideClass?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function StudentTable({
  students,
  hideClass = false,
  emptyTitle = 'Nenhum aluno encontrado',
  emptyDescription = 'Ajuste a busca e os filtros para encontrar a criança.',
  emptyAction,
}: StudentTableProps) {
  const columns = [identity, code, ...(hideClass ? [] : [className]), birthDate, status, actions];

  return (
    <DataTable
      data={students}
      columns={columns}
      rowKey={(student) => student.id}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={emptyAction}
    />
  );
}
