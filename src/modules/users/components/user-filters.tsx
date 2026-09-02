'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/shared/components/input';
import { Select } from '@/shared/components/select';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';

const MIN_SEARCH_LENGTH = 2;

export function UserFilters({ profiles }: { profiles: string[] }) {
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
            placeholder="Nome ou e-mail"
            autoComplete="off"
            className="pl-9"
            onChange={(event) => setTerm(event.target.value)}
          />
        </div>
      </div>

      {profiles.length > 0 && (
        <div className="flex min-w-48 flex-col gap-1.5">
          <label htmlFor="filtro-perfil" className="text-sm font-medium">
            Perfil
          </label>
          <Select
            id="filtro-perfil"
            value={get('profile') ?? ALL}
            onValueChange={(value) => set('profile', value)}
            options={[
              { value: ALL, label: 'Todos os perfis' },
              ...profiles.map((profile) => ({ value: profile, label: profile })),
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
            { value: ALL, label: 'Ativas e desativadas' },
            { value: 'true', label: 'Somente ativas' },
            { value: 'false', label: 'Somente desativadas' },
          ]}
        />
      </div>
    </div>
  );
}
