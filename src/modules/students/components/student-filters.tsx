'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/input';
import { Select } from '@/shared/components/select';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';

const MIN_SEARCH_LENGTH = 2;

export function StudentFilters({ lockedClassId }: { lockedClassId?: string }) {
  const { get, set } = useUrlFilters();
  const classes = useFindListClasses({ limit: 100 });

  const [term, setTerm] = useState(get('search') ?? '');
  const debounced = useDebounce(term);

  useEffect(() => {
    const current = get('search') ?? '';
    const next = debounced.trim();

    if (next === current) return;
    if (next.length > 0 && next.length < MIN_SEARCH_LENGTH) return;

    set('search', next.length === 0 ? null : next);
  }, [debounced, get, set]);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-64 flex-1 flex-col gap-1.5">
        <label htmlFor="filtro-busca" className="text-sm font-medium">
          Buscar
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
          />
          <Input
            id="filtro-busca"
            type="search"
            value={term}
            placeholder="Nome do aluno"
            autoComplete="off"
            className="pl-9"
            onChange={(event) => setTerm(event.target.value)}
          />
        </div>
      </div>

      {lockedClassId === undefined && (
        <div className="flex min-w-48 flex-col gap-1.5">
          <label htmlFor="filtro-turma" className="text-sm font-medium">
            Turma
          </label>
          <Select
            id="filtro-turma"
            value={get('classId') ?? ALL}
            onValueChange={(value) => set('classId', value)}
            options={[
              { value: ALL, label: 'Todas as turmas' },
              ...(classes.data?.results ?? []).map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
          />
        </div>
      )}

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-situacao" className="text-sm font-medium">
          Situação
        </label>
        <Select
          id="filtro-situacao"
          value={get('active') ?? ALL}
          onValueChange={(value) => set('active', value)}
          options={[
            { value: ALL, label: 'Ativos e inativos' },
            { value: 'true', label: 'Somente ativos' },
            { value: 'false', label: 'Somente inativos' },
          ]}
        />
      </div>
    </div>
  );
}
