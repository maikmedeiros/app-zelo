'use client';

import { Popover as PopoverPrimitive } from 'radix-ui';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { ptBR } from '@/shared/i18n/pt-BR';
import { cn } from '@/shared/utils/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

export interface ComboboxProps {
  id?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: ComboboxOption[];
  onSearch?: (term: string) => void;
  loading?: boolean;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  id,
  value,
  onChange,
  options,
  onSearch,
  loading = false,
  placeholder = ptBR.common.search,
  invalid = false,
  disabled = false,
  className,
}: ComboboxProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedTerm = useDebounce(term);

  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onSearchRef.current?.(debouncedTerm);
  }, [debouncedTerm]);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const commit = (option: ComboboxOption) => {
    onChange(option.value);
    setOpen(false);
    setTerm('');
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      const option = options[activeIndex];
      if (option !== undefined) {
        event.preventDefault();
        commit(option);
      }
      return;
    }

    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Anchor asChild>
        <div
          className={cn(
            'flex w-full items-center gap-2 rounded-control border bg-surface px-3',
            invalid ? 'border-danger' : 'border-border',
            disabled && 'opacity-60',
            className,
          )}
        >
          <input
            id={id}
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-invalid={invalid}
            disabled={disabled}
            value={open ? term : (selected?.label ?? '')}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setTerm(event.target.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent py-2 outline-none"
          />

          {loading ? (
            <Loader2 aria-hidden className="size-4 animate-spin text-text-muted" />
          ) : (
            <ChevronDown aria-hidden className="size-4 text-text-muted" />
          )}
        </div>
      </PopoverPrimitive.Anchor>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-50 max-h-72 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-card border border-border bg-surface p-1 shadow-lg"
        >
          <ul id={listId} role="listbox" className="flex flex-col">
            {options.length === 0 && (
              <li className="px-3 py-3 text-sm text-text-muted">{ptBR.common.noResults}</li>
            )}

            {options.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(option)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-control px-3 text-left text-sm',
                    index === activeIndex && 'bg-surface-muted',
                  )}
                >
                  <span className="flex flex-col py-1">
                    {option.label}
                    {option.hint !== undefined && (
                      <span className="text-xs text-text-muted">{option.hint}</span>
                    )}
                  </span>
                  {option.value === value && <Check aria-hidden className="size-4 text-brand" />}
                </button>
              </li>
            ))}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
