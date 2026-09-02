'use client';

import { Select } from '@/shared/components/select';
import { ALL, useUrlFilters } from '@/shared/hooks/use-url-filters';
import { ptBR } from '@/shared/i18n/pt-BR';
import { CONSENT_TYPES } from '@/modules/students/types';

export function ClassConsentFilters() {
  const { get, set } = useUrlFilters();

  return (
    <div className="flex min-w-64 max-w-sm flex-col gap-1.5">
      <label htmlFor="filtro-sem-consentimento" className="text-sm font-medium">
        Mostrar
      </label>
      <Select
        id="filtro-sem-consentimento"
        value={get('missing') ?? ALL}
        onValueChange={(value) => set('missing', value)}
        options={[
          { value: ALL, label: 'Todas as crianças' },
          ...CONSENT_TYPES.map((type) => ({
            value: type,
            label: `Sem autorização · ${ptBR.enums.consentType[type]}`,
          })),
        ]}
      />
    </div>
  );
}
