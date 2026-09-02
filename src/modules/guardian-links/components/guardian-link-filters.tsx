'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { GuardianPicker } from '@/modules/guardians/components/guardian-picker';
import { StudentPicker } from '@/modules/students/components/student-picker';

export function GuardianLinkFilters() {
  const { get, set } = useUrlFilters();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-56 flex-col gap-1.5">
        <label htmlFor="filtro-responsavel" className="text-sm font-medium">
          Responsável
        </label>
        <GuardianPicker
          id="filtro-responsavel"
          value={get('guardianId')}
          onChange={(guardianId) => set('guardianId', guardianId)}
          emptyLabel="Todos os responsáveis"
          placeholder="Todos os responsáveis"
        />
      </div>

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
