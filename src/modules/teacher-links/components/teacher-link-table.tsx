import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import type { TeacherLinkOutput } from '../types';

const columns: Column<TeacherLinkOutput>[] = [
  {
    key: 'teacher',
    header: 'Professor',
    cell: (link) => (
      <span className="flex items-center gap-3">
        <Avatar name={link.teacherName} size="sm" />
        <span className="font-medium">{link.teacherName}</span>
      </span>
    ),
  },
  {
    key: 'role',
    header: 'Função',
    cell: (link) => <Badge tone="brand">{ptBR.enums.teacherRole[link.role]}</Badge>,
  },
  { key: 'startDate', header: 'Desde', cell: (link) => formatDate(link.startDate) },
  {
    key: 'endDate',
    header: 'Situação',
    cell: (link) =>
      link.endDate === null ? (
        <Badge tone="success">Vigente</Badge>
      ) : (
        <Badge>Encerrado em {formatDate(link.endDate)}</Badge>
      ),
  },
];

export function TeacherLinkTable({ links }: { links: Paginated<TeacherLinkOutput> }) {
  return (
    <DataTable
      data={links}
      columns={columns}
      rowKey={(link) => link.id}
      emptyTitle="Nenhum professor vinculado"
      emptyDescription="Os vínculos de professor com turma são criados na tela de vínculos."
    />
  );
}
