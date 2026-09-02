'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { cn } from '@/shared/utils/cn';
import { isValidCpf, maskCpf, normalizeCpf } from '@/shared/utils/cpf';

const MIN_SEARCH_LENGTH = 2;

const ROLE_CHIPS = [
  { value: ALL, label: 'Todos' },
  { value: 'none', label: 'Sem papel', highlight: true },
  { value: 'student', label: 'Alunos' },
  { value: 'guardian', label: 'Responsáveis' },
  { value: 'teacher', label: 'Professores' },
] as const;

export function PersonFilters() {
  const { get, set } = useUrlFilters();

  const [term, setTerm] = useState(get('search') ?? '');
  const [cpf, setCpf] = useState(() => {
    const current = get('cpf');
    return current === null ? '' : maskCpf(current);
  });

  const debouncedTerm = useDebounce(term);
  const debouncedCpf = useDebounce(cpf);

  const typedDigits = normalizeCpf(debouncedCpf);
  const cpfInvalid = typedDigits.length === 11 && !isValidCpf(typedDigits);

  useEffect(() => {
    const current = get('search') ?? '';
    const next = debouncedTerm.trim();

    if (next === current) return;
    if (next.length > 0 && next.length < MIN_SEARCH_LENGTH) return;

    set('search', next.length === 0 ? null : next);
  }, [debouncedTerm, get, set]);

  useEffect(() => {
    const current = get('cpf') ?? '';
    const digits = normalizeCpf(debouncedCpf);
    const next = isValidCpf(digits) ? digits : '';

    if (next === current) return;
    if (digits.length > 0 && next.length === 0) return;

    set('cpf', next.length === 0 ? null : next);
  }, [debouncedCpf, get, set]);

  const role = get('role') ?? ALL;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <div className="flex min-w-64 flex-1 flex-col gap-1.5">
          <label htmlFor="filtro-busca" className="text-sm font-medium">
            Buscar por nome
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
              placeholder="Nome ou nome social"
              autoComplete="off"
              className="pl-9"
              onChange={(event) => setTerm(event.target.value)}
            />
          </div>
        </div>

        <Field
          id="filtro-cpf"
          label="CPF"
          className="min-w-56"
          hint="Com ou sem máscara."
          error={cpfInvalid ? 'CPF inválido.' : undefined}
        >
          <Input
            id="filtro-cpf"
            value={cpf}
            inputMode="numeric"
            placeholder="000.000.000-00"
            autoComplete="off"
            aria-invalid={cpfInvalid}
            onChange={(event) => setCpf(maskCpf(event.target.value))}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Papel</span>

        {ROLE_CHIPS.map((chip) => {
          const active = role === chip.value;
          const highlight = 'highlight' in chip && chip.highlight;

          return (
            <button
              key={chip.value}
              type="button"
              aria-pressed={active}
              onClick={() => set('role', chip.value)}
              className={cn(
                'min-h-11 rounded-control border px-3 text-sm font-medium',
                active
                  ? 'border-brand bg-brand text-on-brand'
                  : highlight
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-border bg-surface text-text-muted hover:text-text',
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
