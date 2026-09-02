'use client';

import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/shared/components/combobox';
import { formatCpf } from '@/shared/utils/cpf';
import { formatDate } from '@/shared/utils/date';
import { useFindListPeople } from '../api/find-list-people.client';
import { displayName, type PersonOutput, type PersonRoleFilter } from '../types';

const hintFor = (person: PersonOutput): string | undefined => {
  if (person.cpf !== null) return formatCpf(person.cpf);
  if (person.birthDate !== null) return `Nascimento ${formatDate(person.birthDate)}`;

  return undefined;
};

const toOption = (person: PersonOutput): ComboboxOption => ({
  value: person.id,
  label: displayName(person),
  hint: hintFor(person),
});

export interface PersonPickerProps {
  id: string;
  value: string | null;
  onChange: (personId: string | null) => void;
  role?: PersonRoleFilter;
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

  return (
    <Combobox
      id={id}
      value={value}
      onChange={onChange}
      onSearch={setSearch}
      loading={people.isFetching}
      placeholder={placeholder}
      invalid={invalid}
      options={(people.data?.results ?? []).map(toOption)}
    />
  );
}
