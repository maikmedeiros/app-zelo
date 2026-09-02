'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { RolePicker } from '@/modules/roles/components/role-picker';
import { UserPicker } from '@/modules/users/components/user-picker';

export function RoleGrantFilters() {
  const { get, set } = useUrlFilters();

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
          emptyLabel="Todas as contas"
          placeholder="Todas as contas"
        />
      </div>

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-perfil" className="text-sm font-medium">
          Perfil
        </label>
        <RolePicker
          id="filtro-perfil"
          value={get('roleId')}
          onChange={(roleId) => set('roleId', roleId)}
          emptyLabel="Todos os perfis"
          placeholder="Todos os perfis"
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
