'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';
import { StudentPicker } from '@/modules/students/components/student-picker';

export function EnrollmentFilters() {
  const { get, set } = useUrlFilters();
  const classes = useFindListClasses({ limit: 100 });

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-56 flex-col gap-1.5">
        <label htmlFor="filtro-aluno" className="text-sm font-medium">
          Aluno
        </label>
        <StudentPicker
          id="filtro-aluno"
          value={get('studentId')}
          onChange={(studentId) => set('studentId', studentId)}
          active={false}
          emptyLabel="Todos os alunos"
          placeholder="Todos os alunos"
        />
      </div>

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-turma" className="text-sm font-medium">
          Turma
        </label>
        <Select
          id="filtro-turma"
          value={get('classId') ?? ALL}
          onValueChange={(value) => set('classId', value)}
          options={[
            { value: ALL, label: 'Todas as turmas' },
            ...(classes.data?.results ?? []).map((item) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
        />
      </div>

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-vigencia" className="text-sm font-medium">
          Vigência
        </label>
        <Select
          id="filtro-vigencia"
          value={get('active') ?? ALL}
          onValueChange={(value) => set('active', value)}
          options={[
            { value: ALL, label: 'Vigentes e encerradas' },
            { value: 'true', label: 'Somente vigentes' },
            { value: 'false', label: 'Somente encerradas' },
          ]}
        />
      </div>
    </div>
  );
}
