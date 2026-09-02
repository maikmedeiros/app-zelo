'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { ptBR } from '@/shared/i18n/pt-BR';
import { CONSENT_TYPES } from '../types';

export function ConsentFilters() {
  const { get, set } = useUrlFilters();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex min-w-56 flex-col gap-1.5">
        <label htmlFor="filtro-consentimento-tipo" className="text-sm font-medium">
          Tipo
        </label>
        <Select
          id="filtro-consentimento-tipo"
          value={get('type') ?? ALL}
          onValueChange={(value) => set('type', value)}
          options={[
            { value: ALL, label: 'Todos os tipos' },
            ...CONSENT_TYPES.map((type) => ({
              value: type,
              label: ptBR.enums.consentType[type],
            })),
          ]}
        />
      </div>

      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="filtro-consentimento-vigencia" className="text-sm font-medium">
          Vigência
        </label>
        <Select
          id="filtro-consentimento-vigencia"
          value={get('current') ?? ALL}
          onValueChange={(value) => set('current', value)}
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
