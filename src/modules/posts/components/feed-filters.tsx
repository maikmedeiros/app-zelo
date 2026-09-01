'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Select } from '@/shared/components/select';
import { ptBR } from '@/shared/i18n/pt-BR';
import type { Paginated } from '@/shared/api/types';
import type { StudentOutput } from '@/modules/students/types';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';
import { StudentFilter } from './student-filter';
import { POST_TYPES } from '../types';

const ALL = 'todos';

export function FeedFilters({ students }: { students: Paginated<StudentOutput> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const canSeeDrafts = useCan(Feature.PostCreate);

  const classes = useFindListClasses({ limit: 100 });

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === ALL) params.delete(key);
    else params.set(key, value);

    params.delete('page');

    const query = params.toString();
    router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-turma" className="text-sm font-medium">
          Turma
        </label>
        <Select
          id="filtro-turma"
          value={searchParams.get('classId') ?? ALL}
          onValueChange={(value) => update('classId', value)}
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
        value={searchParams.get('studentId')}
        initialStudents={students}
        onChange={(studentId) => update('studentId', studentId ?? ALL)}
      />

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-tipo" className="text-sm font-medium">
          Tipo
        </label>
        <Select
          id="filtro-tipo"
          value={searchParams.get('type') ?? ALL}
          onValueChange={(value) => update('type', value)}
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
            value={searchParams.get('status') ?? 'PUBLICADA'}
            onValueChange={(value) => update('status', value)}
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
