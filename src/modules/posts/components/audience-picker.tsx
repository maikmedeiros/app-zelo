'use client';

import { useState } from 'react';
import { Checkbox } from '@/shared/components/checkbox';
import { Combobox } from '@/shared/components/combobox';
import { EmptyState } from '@/shared/components/empty-state';
import { Field } from '@/shared/components/field';
import { ptBR } from '@/shared/i18n/pt-BR';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';
import { useFindListStudents } from '@/modules/students/api/find-list-students.client';
import type { PostAudience } from '../types';

export interface AudienceValue {
  audience: PostAudience;
  classIds: string[];
  studentIds: string[];
}

export function AudiencePicker({
  value,
  onChange,
  error,
}: {
  value: AudienceValue;
  onChange: (value: AudienceValue) => void;
  error?: string;
}) {
  const [search, setSearch] = useState('');
  const classes = useFindListClasses({ limit: 100 });
  const students = useFindListStudents({
    limit: 20,
    active: true,
    ...(search.length >= 2 ? { search } : {}),
  });

  const toggleClass = (id: string) => {
    const next = value.classIds.includes(id)
      ? value.classIds.filter((current) => current !== id)
      : [...value.classIds, id];

    onChange({ ...value, classIds: next });
  };

  const addStudent = (id: string | null) => {
    if (id === null || value.studentIds.includes(id)) return;

    onChange({ ...value, studentIds: [...value.studentIds, id] });
  };

  const studentName = (id: string): string =>
    students.data?.results.find((item) => item.id === id)?.personName ?? id;

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Para quem é esta postagem?</legend>

        <div className="flex flex-wrap gap-2">
          {(['TURMA', 'ALUNO'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value.audience === option}
              onClick={() => onChange({ audience: option, classIds: [], studentIds: [] })}
              className={
                value.audience === option
                  ? 'min-h-11 rounded-control border border-brand bg-brand-soft px-3 text-sm text-brand'
                  : 'min-h-11 rounded-control border border-border px-3 text-sm'
              }
            >
              {ptBR.enums.postAudience[option]}
            </button>
          ))}
        </div>
      </fieldset>

      {value.audience === 'TURMA' ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Turmas</legend>

          {(classes.data?.results ?? []).length === 0 ? (
            <EmptyState title="Nenhuma turma disponível" />
          ) : (
            (classes.data?.results ?? []).map((item) => (
              <Checkbox
                key={item.id}
                id={`turma-${item.id}`}
                label={`${item.name} · ${ptBR.enums.classShift[item.shift]}`}
                checked={value.classIds.includes(item.id)}
                onCheckedChange={() => toggleClass(item.id)}
              />
            ))
          )}
        </fieldset>
      ) : (
        <div className="flex flex-col gap-2">
          <Field id="aluno" label="Alunos">
            <Combobox
              id="aluno"
              value={null}
              onChange={addStudent}
              onSearch={setSearch}
              loading={students.isFetching}
              placeholder="Buscar aluno pelo nome"
              options={(students.data?.results ?? []).map((item) => ({
                value: item.id,
                label: item.personName,
                hint: item.className ?? undefined,
              }))}
            />
          </Field>

          <ul className="flex flex-wrap gap-2">
            {value.studentIds.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      studentIds: value.studentIds.filter((current) => current !== id),
                    })
                  }
                  className="min-h-11 rounded-control border border-border px-3 text-sm"
                >
                  {studentName(id)} ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error !== undefined && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
