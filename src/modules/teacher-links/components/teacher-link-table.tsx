import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { Avatar } from '@/shared/components/avatar';
import { Badge } from '@/shared/components/badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import { EndTeacherLinkButton } from './end-teacher-link-button';
import { isCurrent, type TeacherLinkOutput } from '../types';

const teacher: Column<TeacherLinkOutput> = {
  key: 'teacher',
  header: 'Professor',
  cell: (link) => (
    <span className="flex items-center gap-3">
      <Avatar name={link.teacherName} size="sm" />
      <Link
        href={`/teachers/${link.teacherId}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {link.teacherName}
      </Link>
    </span>
  ),
};

const turma: Column<TeacherLinkOutput> = {
  key: 'class',
  header: 'Turma',
  cell: (link) => (
    <Link href={`/classes/${link.classId}`} className="underline-offset-4 hover:underline">
      {link.className}
    </Link>
  ),
};

const role: Column<TeacherLinkOutput> = {
  key: 'role',
  header: 'Função',
  cell: (link) => <Badge tone="brand">{ptBR.enums.teacherRole[link.role]}</Badge>,
};

const validity: Column<TeacherLinkOutput> = {
  key: 'validity',
  header: 'Vigência',
  cell: (link) =>
    isCurrent(link) ? (
      <Badge tone="success">Desde {formatDate(link.startDate)}</Badge>
    ) : (
      <Badge>Encerrado em {formatDate(link.endDate ?? '')}</Badge>
    ),
};

const actions: Column<TeacherLinkOutput> = {
  key: 'actions',
  header: '',
  align: 'right',
  cell: (link) => <EndTeacherLinkButton link={link} />,
};

export interface TeacherLinkTableProps {
  links: Paginated<TeacherLinkOutput>;
  hideClass?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TeacherLinkTable({
  links,
  hideClass = false,
  emptyTitle = 'Nenhum vínculo encontrado',
  emptyDescription = 'É o vínculo de professor que dá o escopo de escrita na turma.',
}: TeacherLinkTableProps) {
  return (
    <DataTable
      data={links}
      columns={[teacher, ...(hideClass ? [] : [turma]), role, validity, actions]}
      rowKey={(link) => link.id}
      rowClassName={(link) => (isCurrent(link) ? undefined : 'text-text-muted')}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
