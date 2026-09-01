'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { ptBR } from '@/shared/i18n/pt-BR';
import { useFindListSchoolYears } from '@/modules/school-years/api/find-list-school-years.client';
import { CLASS_SHIFTS } from '../types';

export function ClassFilters() {
  const { get, set } = useUrlFilters();
  const schoolYears = useFindListSchoolYears();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-ano" className="text-sm font-medium">
          Ano letivo
        </label>
        <Select
          id="filtro-ano"
          value={get('schoolYearId') ?? ALL}
          onValueChange={(value) => set('schoolYearId', value)}
          options={[
            { value: ALL, label: 'Todos os anos' },
            ...(schoolYears.data?.results ?? []).map((year) => ({
              value: year.id,
              label: `${year.year}`,
            })),
          ]}
        />
      </div>

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-turno" className="text-sm font-medium">
          Turno
        </label>
        <Select
          id="filtro-turno"
          value={get('shift') ?? ALL}
          onValueChange={(value) => set('shift', value)}
          options={[
            { value: ALL, label: 'Todos os turnos' },
            ...CLASS_SHIFTS.map((shift) => ({
              value: shift,
              label: ptBR.enums.classShift[shift],
            })),
          ]}
        />
      </div>
    </div>
  );
}
