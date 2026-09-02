'use client';

import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/shared/components/combobox';
import { ALL } from '@/shared/hooks/use-url-filters';
import { formatCpf } from '@/shared/utils/cpf';
import { useFindListGuardians } from '../api/find-list-guardians.client';
import type { GuardianOutput } from '../types';

const toOption = (guardian: GuardianOutput): ComboboxOption => ({
  value: guardian.id,
  label: guardian.personName,
  hint: guardian.cpf === null ? undefined : formatCpf(guardian.cpf),
});

export interface GuardianPickerProps {
  id: string;
  value: string | null;
  onChange: (guardianId: string | null) => void;
  emptyLabel?: string;
  placeholder?: string;
  invalid?: boolean;
}

export function GuardianPicker({
  id,
  value,
  onChange,
  emptyLabel,
  placeholder = 'Busque pelo nome',
  invalid = false,
}: GuardianPickerProps) {
  const [search, setSearch] = useState('');
  const term = search.trim();

  const guardians = useFindListGuardians({
    limit: 20,
    ...(term.length >= 2 ? { search: term } : {}),
  });

  const options: ComboboxOption[] = (guardians.data?.results ?? []).map(toOption);

  if (emptyLabel !== undefined) options.unshift({ value: ALL, label: emptyLabel });

  return (
    <Combobox
      id={id}
      value={value ?? (emptyLabel === undefined ? null : ALL)}
      onChange={(next) => onChange(next === ALL ? null : next)}
      onSearch={setSearch}
      loading={guardians.isFetching}
      placeholder={placeholder}
      invalid={invalid}
      options={options}
    />
  );
}
