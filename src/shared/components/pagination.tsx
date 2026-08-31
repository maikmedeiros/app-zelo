'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUrlPagination } from '@/shared/hooks/use-url-pagination';
import { ptBR } from '@/shared/i18n/pt-BR';
import { Button } from './button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalResults: number;
}

export function Pagination({ page, totalPages, totalResults }: PaginationProps) {
  const { goTo } = useUrlPagination();

  if (totalPages <= 1) {
    return <p className="text-sm text-text-muted">{ptBR.common.resultCount(totalResults)}</p>;
  }

  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-text-muted">{ptBR.common.resultCount(totalResults)}</p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          aria-label={ptBR.common.previousPage}
        >
          <ChevronLeft aria-hidden className="size-4" />
          {ptBR.common.previousPage}
        </Button>

        <span aria-live="polite" className="text-sm text-text-muted">
          {ptBR.common.pageOf(page, totalPages)}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
          aria-label={ptBR.common.nextPage}
        >
          {ptBR.common.nextPage}
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
