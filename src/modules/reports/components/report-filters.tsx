'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { ptBR } from '@/shared/i18n/pt-BR';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';
import { StudentPicker } from '@/modules/students/components/student-picker';
import { REPORT_STATUSES } from '../types';

export function ReportFilters() {
  const { get, set } = useUrlFilters();
  const classes = useFindListClasses({ limit: 100 });

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-56 flex-col gap-1.5">
        <label htmlFor="filtro-aluno" className="text-sm font-medium">
          Criança
        </label>
        <StudentPicker
          id="filtro-aluno"
          value={get('studentId')}
          onChange={(studentId) => set('studentId', studentId)}
          active={false}
          emptyLabel="Todas as crianças"
          placeholder="Todas as crianças"
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
        <label htmlFor="filtro-situacao" className="text-sm font-medium">
          Situação
        </label>
        <Select
          id="filtro-situacao"
          value={get('status') ?? ALL}
          onValueChange={(value) => set('status', value)}
          options={[
            { value: ALL, label: 'Rascunhos e publicados' },
            ...REPORT_STATUSES.map((status) => ({
              value: status,
              label: ptBR.enums.reportStatus[status],
            })),
          ]}
        />
      </div>
    </div>
  );
}
