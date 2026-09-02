import type { ReactNode } from 'react';
import type { Paginated } from '@/shared/api/types';
import { EmptyState } from './empty-state';
import { Pagination } from './pagination';
import { Table, TBody, TableWrapper, Td, Th, THead, Tr } from './table';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  cell: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: Paginated<T>;
  columns: Column<T>[];
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string | undefined;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  rowClassName,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  if (data.results.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <TableWrapper>
        <Table>
          <THead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.key} className={column.align === 'right' ? 'text-right' : ''}>
                  {column.header}
                </Th>
              ))}
            </Tr>
          </THead>
          <TBody>
            {data.results.map((row) => (
              <Tr key={rowKey(row)} className={rowClassName?.(row)}>
                {columns.map((column) => (
                  <Td key={column.key} className={column.align === 'right' ? 'text-right' : ''}>
                    {column.cell(row)}
                  </Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>
      </TableWrapper>

      <Pagination page={data.page} totalPages={data.totalPages} totalResults={data.totalResults} />
    </div>
  );
}
