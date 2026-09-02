import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatCpf } from '@/shared/utils/cpf';
import type { TeacherOutput } from '../types';

const columns: Column<TeacherOutput>[] = [
  {
    key: 'personName',
    header: 'Professor',
    cell: (teacher) => (
      <span className="flex items-center gap-3">
        <Avatar name={teacher.personName} personId={teacher.personId} size="sm" />
        <Link
          href={`/teachers/${teacher.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {teacher.personName}
        </Link>
      </span>
    ),
  },
  {
    key: 'registration',
    header: 'Matrícula funcional',
    cell: (teacher) => teacher.registration ?? '—',
  },
  {
    key: 'cpf',
    header: 'CPF',
    cell: (teacher) => (teacher.cpf === null ? '—' : formatCpf(teacher.cpf)),
  },
  {
    key: 'active',
    header: 'Situação',
    cell: (teacher) =>
      teacher.active ? <Badge tone="success">Ativo</Badge> : <Badge tone="danger">Inativo</Badge>,
  },
  { key: 'classCount', header: 'Turmas', align: 'right', cell: (teacher) => teacher.classCount },
];

export function TeacherTable({ teachers }: { teachers: Paginated<TeacherOutput> }) {
  return (
    <DataTable
      data={teachers}
      columns={columns}
      rowKey={(teacher) => teacher.id}
      emptyTitle="Nenhum professor encontrado"
      emptyDescription="Ajuste a busca ou cadastre a pessoa antes de dar a ela o papel de professor."
    />
  );
}
