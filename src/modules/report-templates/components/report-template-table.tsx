import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { DataTable, type Column } from '@/shared/components/data-table';
import { formatDate } from '@/shared/utils/date';
import type { ReportTemplateOutput } from '../types';

const columns: Column<ReportTemplateOutput>[] = [
  {
    key: 'name',
    header: 'Modelo',
    cell: (template) => (
      <Link
        href={`/report-templates/${template.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {template.name}
      </Link>
    ),
  },
  {
    key: 'description',
    header: 'Descrição',
    cell: (template) => template.description ?? '—',
  },
  {
    key: 'items',
    header: 'Dimensões',
    align: 'right',
    cell: (template) => template.itemCount,
  },
  {
    key: 'author',
    header: 'Autor',
    cell: (template) => template.authorName,
  },
  {
    key: 'updated',
    header: 'Atualizado',
    cell: (template) => formatDate(template.updatedAt),
  },
];

export function ReportTemplateTable({ templates }: { templates: Paginated<ReportTemplateOutput> }) {
  return (
    <DataTable
      data={templates}
      columns={columns}
      rowKey={(template) => template.id}
      emptyTitle="Nenhum modelo cadastrado"
      emptyDescription="O modelo é o texto de partida de um relatório — o que se repete de uma criança para outra, escrito uma vez só."
    />
  );
}
