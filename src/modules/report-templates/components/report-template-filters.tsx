'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/input';
import { useUrlFilters } from '@/shared/hooks/use-url-filters';

export function ReportTemplateFilters() {
  const { get, set } = useUrlFilters();
  const current = get('search') ?? '';
  const [term, setTerm] = useState(current);

  useEffect(() => {
    if (term === current) return;

    const timer = setTimeout(() => set('search', term.trim() === '' ? null : term.trim()), 400);
    return () => clearTimeout(timer);
  }, [term, current, set]);

  return (
    <div className="flex min-w-64 max-w-sm flex-col gap-1.5">
      <label htmlFor="filtro-modelo" className="text-sm font-medium">
        Buscar
      </label>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
        />
        <Input
          id="filtro-modelo"
          value={term}
          placeholder="Nome do modelo"
          className="pl-9"
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>
    </div>
  );
}
