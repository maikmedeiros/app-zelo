'use client';

import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/shared/components/combobox';
import { ALL } from '@/shared/hooks/use-url-filters';
import { useFindListUsers } from '../api/find-list-users.client';
import type { UserAccountOutput } from '../types';

const toOption = (user: UserAccountOutput): ComboboxOption => ({
  value: user.id,
  label: user.personName,
  hint: user.email,
});

export interface UserPickerProps {
  id: string;
  value: string | null;
  onChange: (userId: string | null) => void;
  active?: boolean;
  emptyLabel?: string;
  placeholder?: string;
  invalid?: boolean;
}

export function UserPicker({
  id,
  value,
  onChange,
  active = true,
  emptyLabel,
  placeholder = 'Busque por nome ou e-mail',
  invalid = false,
}: UserPickerProps) {
  const [search, setSearch] = useState('');
  const term = search.trim();

  const users = useFindListUsers({
    limit: 20,
    active,
    ...(term.length >= 2 ? { search: term } : {}),
  });

  const options: ComboboxOption[] = (users.data?.results ?? []).map(toOption);

  if (emptyLabel !== undefined) options.unshift({ value: ALL, label: emptyLabel });

  return (
    <Combobox
      id={id}
      value={value ?? (emptyLabel === undefined ? null : ALL)}
      onChange={(next) => onChange(next === ALL ? null : next)}
      onSearch={setSearch}
      loading={users.isFetching}
      placeholder={placeholder}
      invalid={invalid}
      options={options}
    />
  );
}
