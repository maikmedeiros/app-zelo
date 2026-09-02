'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { useFindListClasses } from '@/modules/classes/api/find-list-classes.client';
import { UserPicker } from '@/modules/users/components/user-picker';

export function ClassAccessFilters() {
  const { get, set } = useUrlFilters();
  const classes = useFindListClasses({ limit: 100 });

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-56 flex-col gap-1.5">
        <label htmlFor="filtro-conta" className="text-sm font-medium">
          Conta
        </label>
        <UserPicker
          id="filtro-conta"
          value={get('userId')}
          onChange={(userId) => set('userId', userId)}
          active={false}
          emptyLabel="Todas as contas"
          placeholder="Todas as contas"
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
            ...(classes.data?.results ?? []).map((item) => ({ value: item.id, label: item.name })),
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
            { value: ALL, label: 'Vigentes e encerrados' },
            { value: 'true', label: 'Somente vigentes' },
            { value: 'false', label: 'Somente encerrados' },
          ]}
        />
      </div>
    </div>
  );
}
