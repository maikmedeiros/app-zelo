'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/input';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useUrlFilters } from '@/shared/hooks/use-url-filters';
import { StudentPicker } from '@/modules/students/components/student-picker';

const MIN_SEARCH_LENGTH = 2;

export function GuardianFilters() {
  const { get, set } = useUrlFilters();
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
            placeholder="Nome do responsável"
            autoComplete="off"
            className="pl-9"
            onChange={(event) => setTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="flex min-w-56 flex-col gap-1.5">
        <label htmlFor="filtro-aluno" className="text-sm font-medium">
          Responsável por
        </label>
        <StudentPicker
          id="filtro-aluno"
          value={get('studentId')}
          onChange={(studentId) => set('studentId', studentId)}
          emptyLabel="Qualquer criança"
          placeholder="Qualquer criança"
        />
      </div>
    </div>
  );
}
