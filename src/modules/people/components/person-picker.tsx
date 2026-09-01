'use client';

import { useState } from 'react';
import { Combobox } from '@/shared/components/combobox';
import { formatDate } from '@/shared/utils/date';
import { useFindListPeople } from '../api/find-list-people.client';
import type { PersonRole } from '../types';

export interface PersonPickerProps {
  id: string;
  value: string | null;
  onChange: (personId: string | null) => void;
  role?: PersonRole | 'none';
  placeholder?: string;
  invalid?: boolean;
}

export function PersonPicker({
  id,
  value,
  onChange,
  role,
  placeholder = 'Busque pelo nome',
  invalid = false,
}: PersonPickerProps) {
  const [search, setSearch] = useState('');
  const term = search.trim();

  const people = useFindListPeople({
    limit: 20,
    ...(role === undefined ? {} : { role }),
    ...(term.length >= 2 ? { search: term } : {}),
  });

  const options = (people.data?.results ?? []).map((person) => ({
    value: person.id,
    label: person.socialName ?? person.name,
    hint: person.birthDate === null ? undefined : `Nascimento ${formatDate(person.birthDate)}`,
  }));

  return (
    <Combobox
      id={id}
      value={value}
      onChange={onChange}
      onSearch={setSearch}
      loading={people.isFetching}
      placeholder={placeholder}
      invalid={invalid}
      options={options}
    />
  );
}
