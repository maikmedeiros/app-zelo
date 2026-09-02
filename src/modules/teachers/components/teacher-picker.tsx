'use client';

import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/shared/components/combobox';
import { ALL } from '@/shared/hooks/use-url-filters';
import { useFindListTeachers } from '../api/find-list-teachers.client';
import type { TeacherOutput } from '../types';

const toOption = (teacher: TeacherOutput): ComboboxOption => ({
  value: teacher.id,
  label: teacher.personName,
  hint: teacher.registration ?? undefined,
});

export interface TeacherPickerProps {
  id: string;
  value: string | null;
  onChange: (teacherId: string | null) => void;
  active?: boolean;
  emptyLabel?: string;
  placeholder?: string;
  invalid?: boolean;
}

export function TeacherPicker({
  id,
  value,
  onChange,
  active = true,
  emptyLabel,
  placeholder = 'Busque pelo nome',
  invalid = false,
}: TeacherPickerProps) {
  const [search, setSearch] = useState('');
  const term = search.trim();

  const teachers = useFindListTeachers({
    limit: 20,
    active,
    ...(term.length >= 2 ? { search: term } : {}),
  });

  const options: ComboboxOption[] = (teachers.data?.results ?? []).map(toOption);

  if (emptyLabel !== undefined) options.unshift({ value: ALL, label: emptyLabel });

  return (
    <Combobox
      id={id}
      value={value ?? (emptyLabel === undefined ? null : ALL)}
      onChange={(next) => onChange(next === ALL ? null : next)}
      onSearch={setSearch}
      loading={teachers.isFetching}
      placeholder={placeholder}
      invalid={invalid}
      options={options}
    />
  );
}
