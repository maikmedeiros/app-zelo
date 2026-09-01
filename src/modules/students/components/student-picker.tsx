'use client';

import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@/shared/components/combobox';
import { ALL } from '@/shared/hooks/use-url-filters';
import { useFindListStudents } from '../api/find-list-students.client';
import { useFindStudentById } from '../api/find-student-by-id.client';
import type { StudentOutput } from '../types';

const toOption = (student: StudentOutput): ComboboxOption => ({
  value: student.id,
  label: student.personName,
  hint: student.className ?? 'Sem turma vigente',
});

export interface StudentPickerProps {
  id: string;
  value: string | null;
  onChange: (studentId: string | null) => void;
  classId?: string;
  active?: boolean;
  emptyLabel?: string;
  placeholder?: string;
  invalid?: boolean;
}

export function StudentPicker({
  id,
  value,
  onChange,
  classId,
  active = true,
  emptyLabel,
  placeholder = 'Busque pelo nome',
  invalid = false,
}: StudentPickerProps) {
  const [search, setSearch] = useState('');
  const term = search.trim();

  const students = useFindListStudents({
    limit: 20,
    active,
    ...(classId === undefined ? {} : { classId }),
    ...(term.length >= 2 ? { search: term } : {}),
  });

  const selected = useFindStudentById(value);

  const options: ComboboxOption[] = (students.data?.results ?? []).map(toOption);

  const missingSelection =
    value !== null && !options.some((option) => option.value === value) && selected.data;

  if (missingSelection) options.unshift(toOption(missingSelection));

  if (emptyLabel !== undefined) options.unshift({ value: ALL, label: emptyLabel });

  return (
    <Combobox
      id={id}
      value={value ?? (emptyLabel === undefined ? null : ALL)}
      onChange={(next) => onChange(next === ALL ? null : next)}
      onSearch={setSearch}
      loading={students.isFetching || selected.isFetching}
      placeholder={placeholder}
      invalid={invalid}
      options={options}
    />
  );
}
