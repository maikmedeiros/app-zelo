'use client';

import { useState } from 'react';
import { Combobox } from '@/shared/components/combobox';
import type { Paginated } from '@/shared/api/types';
import type { StudentOutput } from '@/modules/students/types';
import { useFindListStudents } from '@/modules/students/api/find-list-students.client';
import { useFindStudentById } from '@/modules/students/api/find-student-by-id.client';

export const ALL_STUDENTS = 'todos';

export interface StudentFilterProps {
  value: string | null;
  onChange: (studentId: string | null) => void;
  initialStudents: Paginated<StudentOutput>;
}

export function StudentFilter({ value, onChange, initialStudents }: StudentFilterProps) {
  const [search, setSearch] = useState('');
  const searching = search.length >= 2;

  const students = useFindListStudents(
    { limit: 20, active: true, ...(searching ? { search } : {}) },
    searching ? undefined : initialStudents,
  );

  const selected = useFindStudentById(value);

  const results = students.data?.results ?? [];

  if (initialStudents.totalResults <= 1 && value === null) return null;

  const options = [
    { value: ALL_STUDENTS, label: 'Todos os alunos' },
    ...results.map((student) => ({
      value: student.id,
      label: student.personName,
      hint: student.className ?? undefined,
    })),
  ];

  const selectedName = selected.data?.personName;
  const known = options.some((option) => option.value === value);

  if (value !== null && !known && selectedName !== undefined) {
    options.push({ value, label: selectedName, hint: selected.data?.className ?? undefined });
  }

  return (
    <div className="flex min-w-48 flex-col gap-1.5">
      <label htmlFor="filtro-aluno" className="text-sm font-medium">
        Aluno
      </label>

      <Combobox
        id="filtro-aluno"
        value={value ?? ALL_STUDENTS}
        onChange={(next) => onChange(next === ALL_STUDENTS || next === null ? null : next)}
        onSearch={setSearch}
        loading={students.isFetching || selected.isFetching}
        placeholder="Todos os alunos"
        options={options}
      />
    </div>
  );
}
