'use client';

import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { ptBR } from '@/shared/i18n/pt-BR';
import type { Paginated } from '@/shared/api/types';
import type { StudentOutput } from '@/modules/students/types';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';
import { StudentFilter } from './student-filter';
import { POST_TYPES } from '../types';

export function FeedFilters({ students }: { students: Paginated<StudentOutput> }) {
  const { get, set } = useUrlFilters();
  const canSeeDrafts = useCan(Feature.PostCreate);

  const classes = useFindListClasses({ limit: 100 });

  return (
    <div className="flex flex-wrap gap-3">
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

      <StudentFilter
        value={get('studentId')}
        initialStudents={students}
        onChange={(studentId) => set('studentId', studentId)}
      />

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-tipo" className="text-sm font-medium">
          Tipo
        </label>
        <Select
          id="filtro-tipo"
          value={get('type') ?? ALL}
          onValueChange={(value) => set('type', value)}
          options={[
            { value: ALL, label: 'Todos os tipos' },
            ...POST_TYPES.map((type) => ({ value: type, label: ptBR.enums.postType[type] })),
          ]}
        />
      </div>

      {canSeeDrafts && (
        <div className="flex min-w-48 flex-col gap-1.5">
          <label htmlFor="filtro-status" className="text-sm font-medium">
            Situação
          </label>
          <Select
            id="filtro-status"
            value={get('status') ?? 'PUBLICADA'}
            onValueChange={(value) => set('status', value)}
            options={[
              { value: 'PUBLICADA', label: ptBR.enums.postStatus.PUBLICADA },
              { value: 'RASCUNHO', label: ptBR.enums.postStatus.RASCUNHO },
            ]}
          />
        </div>
      )}
    </div>
  );
}
